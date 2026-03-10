import bcrypt from "bcryptjs";
import crypto from "crypto";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashed: string
) => {
  return bcrypt.compare(password, hashed);
};

export const hashToken = (rawToken: string) => {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
};