import { useEffect } from "react";
import { useCartContext } from "../context/cart/CartContext";
import { Box, Container, Typography } from "@mui/material";

export default function MyOrdersPage() {
  const { myOrders, getMyOrders } = useCartContext();

  useEffect(() => {
    getMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(myOrders);
  return (
    <Container
      fixed
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      {myOrders.map(({ _id, address, orderItems, total }) => (
        <Box
          key={_id}
          sx={{ border: 1, borderColor: "gray", p: 2, width: "100%" }}
        >
          <Typography>Id: {_id}</Typography>
          <Typography>Address: {address}</Typography>
          <Typography>Items: {orderItems.length}</Typography>
          <Typography>Total: {total}</Typography>
        </Box>
      ))}
    </Container>
  );
}
