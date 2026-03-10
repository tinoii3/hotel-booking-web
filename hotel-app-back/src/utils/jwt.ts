import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRE } from "./constants.js";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const SECRET = process.env.JWT_SECRET;

export const signToken = (payload: object) => {
  return jwt.sign(payload, SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};
