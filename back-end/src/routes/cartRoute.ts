import express from "express";
import { addItemToCart, getActiveCartForUser, updateCartItem } from "../services/cartService.js";
import { validateJWT } from "../middlewares/validateJWT.js";
import type { ExtendRequest } from "../types/extendedRequest.js";

const router = express.Router();


router.get("/", validateJWT, async (req: ExtendRequest, res) => {
    const userId = req.user._id;
    const {statusCode, data} = await getActiveCartForUser({ userId }); 
    res.status(statusCode).send(data);
});

router.post("/items", validateJWT, async (req: ExtendRequest, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    // Call service to add item to cart
    const { statusCode, data } = await addItemToCart({ userId, productId, quantity });
    res.status(statusCode).send(data); 
});

router.put("/items", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  // Call service to update item quantity in cart
  const { statusCode, data } = await updateCartItem({ userId, productId, quantity });
  res.status(statusCode).send(data);
});

export default router;