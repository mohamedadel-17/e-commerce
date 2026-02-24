import { createContext, useContext } from "react";
import type { CartItem } from "../../types/CartItem";

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

interface CartContextType {
  cartItems: CartItem[];
  totalAmount: number;
  myOrders: Order[];
  addItemToCart: (productId: string) => void;
  updateItemInCart: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getMyOrders: () => void;
}

export const CartContext = createContext<CartContextType>({
    cartItems: [],
    totalAmount: 0,
    myOrders: [],
    addItemToCart: () => {},
    updateItemInCart: () => {},
    removeItem: () => {},
    clearCart: () => {},
    getMyOrders: () => {},
});

export const useCartContext = () => useContext(CartContext);
