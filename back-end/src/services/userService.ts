import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register function
interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterParams) => {
  const findUser = await userModel.findOne({ email: email });
  if (findUser) {
    return { data: "User already exists", statusCode: 400 };
  }

  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  return {
    data: generateToken({ firstName, lastName, email }),
    statusCode: 201,
  };
};

// Login function
interface LoginParams {
  email: string;
  password: string;
}
// export const login = (params: LoginParams) => {
export const login = async ({ email, password }: LoginParams) => {
  const findUser = await userModel.findOne({ email });
  if (!findUser) {
    return { data: "Incorrect email or password!", statusCode: 400 };
  }
  const passwordMatch = await bcrypt.compare(password, findUser.password); // await is needed because bcrypt.compare returns a promise
  if (!passwordMatch) {
    return { data: "Incorrect email or password!", statusCode: 400 };
  }
  return {
    data: generateToken({
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      email,
    }),
    statusCode: 200,
  };
};

const generateToken = (data: any) => {
  return jwt.sign(
    data,
    process.env.JWT_SECRET || "kFEn08rxNEfIWzUrpU0vizPtIi0Igtg6BRqb8LoMGXc=",
    { expiresIn: "24h" },
  );
};
