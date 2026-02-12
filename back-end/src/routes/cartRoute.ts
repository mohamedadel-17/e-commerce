import express from "express";
import { getActiveCartForUser } from "../services/cartService.js";
import { validateJWT } from "../middlewares/validateJWT.js";
import type { Request } from "express";

const router = express.Router();

interface ExtendRequest extends Request {
  user?: any;
}

router.get("/", validateJWT, async (req: ExtendRequest, res) => {
    const userId = req.user._id;
    const {statusCode, data} = await getActiveCartForUser({ userId }); 
    res.status(statusCode).send(data);
});


export default router;