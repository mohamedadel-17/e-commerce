import express from "express";
import { login, register } from "../services/userService.js";

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

export default router;
