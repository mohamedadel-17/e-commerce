// Functions:
// - get active cart for a user
// - add item to cart
// - clear cart
// - update item quantity in cart
// - remove item from cart
// - checkout cart

import type { ObjectId } from "mongoose";
import cartModel, { type ICartItem } from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import type { IOrderItem } from "../models/orderModel.js";
import orderModel from "../models/orderModel.js";

// create a new cart for a user
interface CartForUserParams {
  userId: ObjectId;
}
const createCartForUser = async ({ userId }: CartForUserParams) => {
  const cart = await cartModel.create({ userId, totalAmount: 0 });
  return cart;
};

interface GetActiveCartForUserParams {
  userId: ObjectId;
  populateProducts?: boolean;
}
//* get active cart for a user
export const getActiveCartForUser = async ({
  userId,
  populateProducts,
}: GetActiveCartForUserParams) => {
  let cart;
  populateProducts
    ? (cart = await cartModel
        .findOne({ userId, status: "active" })
        .populate("items.productId"))
    : (cart = await cartModel.findOne({ userId, status: "active" }));

  if (!cart) {
    cart = await createCartForUser({ userId });
  }
  return { data: cart, statusCode: 200 };
};
// end get active cart for a user */

interface ClearCartParams {
  userId: ObjectId;
}
//* clear cart
export const clearCart = async ({ userId }: ClearCartParams) => {
  const { data: cart } = await getActiveCartForUser({ userId });
  cart.items = [];
  cart.totalAmount = 0;
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};
// end clear cart */

interface AddItemToCartParams {
  userId: ObjectId;
  productId: any;
  quantity: number;
}
//* add item to cart
export const addItemToCart = async ({
  userId,
  productId,
  quantity,
}: AddItemToCartParams) => {
  const { data } = await getActiveCartForUser({ userId });
  const cart = data;

  // Check if the product is already in the cart
  const existsInCart = cart.items.find(
    (item) => item.productId.toString() === productId,
  );

  if (existsInCart) {
    return { data: { message: "Product already in cart" }, statusCode: 400 };
  }
  // Fetch product
  const product = await productModel.findById(productId);

  if (!product) {
    return { data: { message: "Product not found" }, statusCode: 404 };
  }

  if (product.stock < quantity) {
    return { data: { message: "Insufficient stock" }, statusCode: 400 };
  }

  cart.items.push({
    productId: product._id as unknown as ObjectId, //!!!
    unitPrice: product.price,
    quantity,
  });

  // Update total amount
  cart.totalAmount += product.price * quantity;

  // Save cart
  await cart.save();
  const updatedCart = await getActiveCartForUser({ userId, populateProducts: true });
  return {
    data: updatedCart.data,
    statusCode: 200,
  };
};
// end add item to cart */

interface UpdateCartItemParams {
  userId: ObjectId;
  productId: any;
  quantity: number;
}
//* update item quantity in cart
export const updateCartItem = async ({
  userId,
  productId,
  quantity,
}: UpdateCartItemParams) => {
  const { data: cart } = await getActiveCartForUser({ userId }); // destructure data as cart

  const existsInCart = cart.items.find(
    (item) => item.productId.toString() === productId,
  );
  if (!existsInCart) {
    return { data: { message: "Product not in cart" }, statusCode: 404 };
  }
  // Fetch product
  const product = await productModel.findById(productId);

  if (!product) {
    return { data: { message: "Product not found" }, statusCode: 404 };
  }

  if (product.stock < quantity) {
    return { data: { message: "Insufficient stock" }, statusCode: 400 };
  }

  // Update total amount
  const otherCartItems = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );
  let total = totalAmountForOtherItems({ cartItems: otherCartItems });

  existsInCart.quantity = quantity;

  total += existsInCart.unitPrice * quantity;
  cart.totalAmount = total;

  // Save cart
  await cart.save();
  const updatedCart = await getActiveCartForUser({ userId, populateProducts: true });
  
  return {
    data: updatedCart.data,
    statusCode: 200,
  };
};
// end update item quantity in cart */

interface RemoveCartItemParams {
  userId: ObjectId;
  productId: any;
}
//* remove item from cart
export const removeCartItem = async ({
  userId,
  productId,
}: RemoveCartItemParams) => {
  const { data: cart } = await getActiveCartForUser({ userId }); // destructure data as cart

  const existsInCart = cart.items.find(
    (item) => item.productId.toString() === productId,
  );
  if (!existsInCart) {
    return { data: { message: "Product not in cart" }, statusCode: 404 };
  }

  const otherCartItems = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );

  cart.items = otherCartItems;
  cart.totalAmount = totalAmountForOtherItems({ cartItems: otherCartItems });

  // Save cart
  await cart.save();
  const updatedCart = await getActiveCartForUser({ userId, populateProducts: true });

  return {
    data: updatedCart.data,
    statusCode: 200,
  };
};
// end remove item from cart */

interface CheckoutParams {
  userId: ObjectId;
  address: string;
}
//* checkout cart
export const checkout = async ({ userId, address }: CheckoutParams) => {
  const { data: cart } = await getActiveCartForUser({ userId });

  if (!address) {
    return {
      data: { message: "Address is required for checkout" },
      statusCode: 400,
    };
  }
  if (cart.items.length === 0) {
    return { data: { message: "Cart is empty" }, statusCode: 400 };
  }
  const orderItems: IOrderItem[] = [];
  // Loop cartItems and create orderItems
  for (const item of cart.items) {
    const product = await productModel.findById(item.productId);
    if (!product) {
      return { data: { message: "Product not found" }, statusCode: 404 };
    }
    if (product.stock < item.quantity) {
      return {
        data: { message: `Insufficient stock for product ${product.title}` },
        statusCode: 400,
      };
    }

    const orderItem: IOrderItem = {
      productTitle: product.title,
      productImage: product.image,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    };
    orderItems.push(orderItem);
  }
  const order = await orderModel.create({
    orderItems,
    total: cart.totalAmount,
    address,
    userId,
  });

  // Update cart status to completed
  cart.status = "completed";
  await cart.save();

  return { data: order, statusCode: 200 };
};
// end checkout cart */

//** Additional cart-related service functions
// Helper function to calculate total amount for cart items
const totalAmountForOtherItems = ({
  cartItems,
}: {
  cartItems: ICartItem[];
}) => {
  let total = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return total;
};
