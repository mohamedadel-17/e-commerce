import express from "express";
import { login, register, getMyOrders } from "../services/userService.js";
import type { ExtendRequest } from "../types/extendedRequest.js";
import { validateJWT } from "../middlewares/validateJWT.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { statusCode, data } = await register(req.body);
    // res.status(statusCode).json(data);
    res.status(statusCode).json(data);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { statusCode, data } = await login(req.body);
    res.status(statusCode).json(data);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json("Internal Server Error");
  }
});

router.get("/my-orders", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { statusCode, data } = await getMyOrders({ userId });
    res.status(statusCode).json(data);
  } catch (err) {
    console.error("Error during get my orders: ", err);
    res.status(500).json("Internal Server Error");
  }
});

export default router;
