import { Schema, Document, model, type ObjectId } from "mongoose";
import type { IProduct } from "./productModel.js";

export interface ICartItem {
  productId: IProduct; //!!
  unitPrice: number;
  quantity: number;
}

export interface ICart extends Document {
  userId: ObjectId;
  items: ICartItem[];
  totalAmount: number;
  status: "active" | "completed";
}

const cartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [cartItemSchema], default: [] },
  totalAmount: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ["active", "completed"], default: "active" },
});

export default model<ICart>("Cart", cartSchema);;
