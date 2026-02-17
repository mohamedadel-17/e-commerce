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

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuthContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [err, setErr] = useState<string>("");

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

  const addItemToCart = async (productId: string) => {
    setErr("");
    if (!token) {
      setErr("You must be logged in to add items to the cart.");
      return;
    }
    // Logic to add item to cart and update total amount
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
        setErr(data.message || "Failed to add item to cart");
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

  return (
    <CartContext.Provider value={{ cartItems, totalAmount, addItemToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
