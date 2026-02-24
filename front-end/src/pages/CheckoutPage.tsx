import { Box, Container, TextField, Typography } from "@mui/material";
import type { CartItem } from "../types/CartItem";
import Button from "@mui/material/Button";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuthContext } from "../context/auth/AuthContext";
import { useCartContext } from "../context/cart/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cartItems, totalAmount, clearCart } = useCartContext();
  const { token } = useAuthContext();
  const addressRef = useRef<HTMLInputElement>(null); // const [totalAmount, setTotalAmount] = useState<number>(0);
  const navigate = useNavigate();
  const [err, setErr] = useState<string>("");

  const handleCheckout = async () => {
    const address = addressRef.current?.value;
    if (!address) {
      alert("Please enter a delivery address.");
      return;
    }

    setErr("");
    if (!token) {
      setErr("You must be logged in to add items to the cart.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message);
        console.log("Error:", err); //? for debugging purposes
        return;
      }

      clearCart();
      navigate("/order-success");

    } catch (error) {
      console.error("Error checkout process:", error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* title */}
      <Box
        sx={{
          mt: 4,
          mr: 15,
          ml: 15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Checkout</Typography>
      </Box>
      {/* Display cart items */}
      <Box
        sx={{
          p: 2,
          border: "1px solid #00000031",
          borderRadius: "8px",
          mr: 15,
          ml: 15,
          mt: 2,
        }}
      >
        {/* container for cart items */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {cartItems.map((item: CartItem) => (
            // each cart item
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{ width: "100px", height: "60px", objectFit: "cover" }}
              />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <Typography variant="h6">{item.title}</Typography>
                <Typography>
                  {item.quantity} x {item.unitPrice} USD
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        {/* total amount */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#000000",
              fontWeight: "bold",
            }}
          >
            Total Amount: ${totalAmount.toFixed(2)}
          </Typography>
        </Box>
      </Box>
      {/* pay now button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          inputRef={addressRef}
          label="Delivery Address"
          variant="outlined"
        />

        <Button variant="contained" color="primary" onClick={handleCheckout}>
          Pay Now
        </Button>
      </Box>
    </Container>
  );
}
