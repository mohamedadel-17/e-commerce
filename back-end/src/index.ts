// Entry point of the application
import express from "express";
const app = express(); // Create an Express application
app.use(express.json()); // Middleware to parse JSON request bodies

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB
import mongoose from "mongoose";
mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// CORS middleware
import cors from "cors";
app.use(cors());

// Seed initial products
import { seedInitialProducts } from "./services/productService.js";
seedInitialProducts();

// Routes
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
app.use("/user", userRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });


const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

export default app;