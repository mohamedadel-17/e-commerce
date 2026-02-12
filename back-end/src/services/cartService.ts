import type { ObjectId } from "mongoose";
import cartModel from "../models/cartModel.js";

// create a new cart for a user
interface CartForUserParams {
    userId: ObjectId;
};
const createCartForUser = async ({ userId }: CartForUserParams) => {
    const cart = await cartModel.create({ userId, totalAmount: 0 });
    return cart;
};

// get active cart for a user
export const getActiveCartForUser = async ({ userId }: CartForUserParams) => {
    let cart = await cartModel.findOne({ userId, status: "active" });
    if (!cart) {
        cart = await createCartForUser({ userId });
    }
    return { data: cart, statusCode: 200 };
};

