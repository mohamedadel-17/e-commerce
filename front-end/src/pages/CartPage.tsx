import { Box, Container, Typography } from "@mui/material";
import { useCartContext } from "../context/cart/CartContext";
import type { CartItem } from "../types/CartItem";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalAmount, updateItemInCart, removeItem, clearCart } =
    useCartContext();

  const handleQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return;
    }
    updateItemInCart(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <Container sx={{ mt: 4 }}>
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
        <Typography variant="h5">My Cart</Typography>
        <Button
          variant="text"
          sx={{ color: "#000000a7" }}
          onClick={() => clearCart()}
        >
          Clear Cart
        </Button>
      </Box>
      {/* Display cart items */}
      {cartItems.length === 0 ? (
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Your cart is empty. Please start shopping and add items first.
        </Typography>
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
                <Button
                  onClick={() =>
                    handleQuantity(item.productId, item.quantity - 1)
                  }
                >
                  -
                </Button>
                <Button
                  onClick={() =>
                    handleQuantity(item.productId, item.quantity + 1)
                  }
                >
                  +
                </Button>
              </ButtonGroup>
              <Button
                variant="text"
                sx={{ width: "80px", color: "#000000a7" }}
                onClick={() => handleRemoveItem(item.productId)}
              >
                Remove
              </Button>
            </Box>
          </Box>
        ))
      )}
      {cartItems.length > 0 && (
        <Box
          sx={{ mt: 2, mr: 15, ml: 15, display: "flex", justifyContent: "space-between", flexDirection: "row"}}
        >
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
          <Button variant="contained" sx={{ mt: 1 }} onClick={handleCheckout}>
            Checkout
          </Button>
        </Box>
      )}
    </Container>
  );
}
