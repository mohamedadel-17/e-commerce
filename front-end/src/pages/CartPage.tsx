import { Box, Container, Typography } from "@mui/material";
import { useCartContext } from "../context/cart/CartContext";
import type { CartItem } from "../types/CartItem";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

export default function CartPage() {
  const { cartItems, totalAmount } = useCartContext();

  if (!cartItems) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading your cart...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">My Cart</Typography>
      {/* Display cart items */}
      {cartItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        cartItems.map((item: CartItem) => (
          <Box
            key={item.productId}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              mr: 15,
              ml: 15,
              p: 2,
              border: "1px solid #1976d284",
              borderRadius: "8px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img
                src={item.image}
                alt={item.title}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <Box>
                <Typography variant="h6">{item.title}</Typography>
                <Typography>
                  {item.quantity} x {item.unitPrice} USD
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <ButtonGroup variant="contained" aria-label="Basic button group">
                <Button>-</Button>
                <Button>+</Button>
              </ButtonGroup>
              <Button variant="outlined" sx={{ width: "80px" }}>
                Remove
              </Button>
            </Box>
          </Box>
        ))
      )}
      <Box sx={{ mt: 4, mr: 15, display: "flex", justifyContent: "flex-end" }}>
        <Typography
          variant="h6"
          sx={{
            color: "#1976d2",
            border: "1px solid #1976d284",
            borderRadius: "8px",
            p: 1,
          }}
        >
          Total Amount: ${totalAmount.toFixed(2)}
        </Typography>
      </Box>
    </Container>
  );
}
