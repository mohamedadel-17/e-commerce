import { Box, Container, TextField, Typography } from "@mui/material";
import { useCartContext } from "../context/cart/CartContext";
import type { CartItem } from "../types/CartItem";
import Button from "@mui/material/Button";
import { use, useRef } from "react";

export default function CartPage() {
  const { cartItems, totalAmount } = useCartContext();
  const addressRef = useRef<HTMLInputElement>(null);

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
          }}>
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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2, flexDirection: "column", gap: 2 }}>
        <TextField inputRef={addressRef} label="Delivery Address" variant="outlined"/>

        <Button
          variant="contained"
          color="primary"
          onClick={() => alert("Payment processed!")}
        >
          Pay Now
        </Button>
      </Box>
    </Container>
  );
}
