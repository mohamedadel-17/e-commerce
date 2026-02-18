import { CheckCircleOutline } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 64px)",
        gap: 10,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CheckCircleOutline color="success" sx={{ fontSize: "80px" }} />
        <Typography variant="h4" color="success">
          Thanks for your order
        </Typography>
        <Typography variant="body2">
          We started processing it, and we will get back to you soon
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={() => {
          navigate("/");
        }}
      >
        Go to home page
      </Button>
    </Box>
  );
}
