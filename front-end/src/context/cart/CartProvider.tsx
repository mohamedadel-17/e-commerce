// Functions:
// - add item to cart
// - update item in cart
// - remove item from cart
// - clear all items from cart

import { useState, useEffect, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "../../types/CartItem";
import { BASE_URL } from "../../constants/baseUrl";
import { useAuthContext } from "../auth/AuthContext";

interface ICartItem {
  productId: {
    _id: string;
    title: string;
    image: string;
  };
  unitPrice: number;
  quantity: number;
}

interface OrderItem {
  productTitle: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  total: number;
  address: string;
  userId: string;
  createdAt: string;
  __v: number;
}

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuthContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [err, setErr] = useState<string>("");
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchCartItems = async () => {
      const res = await fetch(`${BASE_URL}/cart`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data || "Failed to fetch cart items");
        return;
      }

      let cartItemsMapped = [];
      if (data?.items && Array.isArray(data.items)) {
        cartItemsMapped = data?.items.map((item: ICartItem) => ({
          productId: item.productId._id,
          title: item.productId.title,
          image: item.productId.image,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        }));
      }
      setCartItems([...cartItemsMapped]);
      setTotalAmount(data.totalAmount);
    };

    fetchCartItems();
  }, [token]);

  //* add item to cart
  const addItemToCart = async (productId: string) => {
    setErr("");
    if (!token) {
      setErr("You must be logged in to add items to the cart.");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message);
        console.log("Error:", err); //? for debugging purposes
        return;
      }

      let cartItemsMapped = [];
      if (data?.items && Array.isArray(data.items)) {
        cartItemsMapped = data?.items.map((item: ICartItem) => ({
          productId: item.productId._id,
          title: item.productId.title,
          image: item.productId.image,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        }));
      }
      setCartItems([...cartItemsMapped]);
      setTotalAmount(data.totalAmount);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  // end add item to cart */

  //* update item in cart
  const updateItemInCart = async (productId: string, quantity: number) => {
    setErr("");
    if (!token) {
      setErr("You must be logged in to update items in the cart.");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/cart/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message);
        console.log("Error:", err); //? for debugging purposes
        return;
      }

      let cartItemsMapped = [];
      if (data?.items && Array.isArray(data.items)) {
        cartItemsMapped = data?.items.map((item: ICartItem) => ({
          productId: item.productId._id,
          title: item.productId.title,
          image: item.productId.image,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        }));
      }
      setCartItems([...cartItemsMapped]);
      setTotalAmount(data.totalAmount);
    } catch (error) {
      console.error("Error updating item in cart:", error);
    }
  };
  // end update item in cart */

  //* remove item from cart
  const removeItem = async (productId: string) => {
    setErr("");
    if (!token) {
      setErr("You must be logged in to remove items from the cart.");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/cart/items/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message);
        console.log("Error:", err); //? for debugging purposes
        return;
      }

      let cartItemsMapped = [];
      if (data?.items && Array.isArray(data.items)) {
        cartItemsMapped = data?.items.map((item: ICartItem) => ({
          productId: item.productId._id,
          title: item.productId.title,
          image: item.productId.image,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        }));
      }
      setCartItems([...cartItemsMapped]);
      setTotalAmount(data.totalAmount);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };
  // end remove item from cart */

  //* clear all items from cart
  const clearCart = async () => {
    setErr("");
    if (!token) {
      setErr("You must be logged in to clear the cart.");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message);
        console.log("Error:", err); //? for debugging purposes
        return;
      }

      setCartItems(data.items || []);
      setTotalAmount(data.totalAmount || 0);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };
  // end clear all items from cart */

  //* get my orders
  const getMyOrders = async () => {
    setErr("");
    if (!token) {
      setErr("You must be logged in to clear the cart.");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/user/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message);
        console.log("Error:", err); //? for debugging purposes
        return;
      }

      setMyOrders(data);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };
  // end get my orders */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalAmount,
        addItemToCart,
        updateItemInCart,
        removeItem,
        clearCart,
        getMyOrders,
        myOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
