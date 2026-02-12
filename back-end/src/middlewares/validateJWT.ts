import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

interface ExtendRequest extends Request {
  user?: any;
}

export const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
  // Extract the token from the Authorization header
  const authorizationHeader = req.headers.authorization;
  // const authorizationHeader = req.get("authorization");
  if (!authorizationHeader) {
    return res.status(401).send({ message: "Authorization header missing" });
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Token missing" });
  }

  // Verify the token

  jwt.verify(
    token,
    process.env.JWT_SECRET || "kFEn08rxNEfIWzUrpU0vizPtIi0Igtg6BRqb8LoMGXc=",
    async (err, payload) => {
      if (err) {
        return res.status(401).send({ message: "Invalid token" });
      }
      if (!payload) {
        return res.status(401).send({ message: "Invalid token payload" });
      }
      // Fetch user from database based on payload information
      const decodedPayload = payload as {
        firstName: string;
        lastName: string;
        email: string;
      };
      const user = await userModel.findOne({ email: decodedPayload.email });
      req.user = user;
      next();
    },
  );
};
