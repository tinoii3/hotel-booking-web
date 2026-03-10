import { prisma } from "../lib/prisma.js";
import {
  findUserByUsername,
  findRefreshTokenByHash,
  rotateRefreshToken,
  logoutUser,
} from "../repository/auth.repository.js";
import { comparePassword, hashPassword, hashToken } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";
import { ACCESS_TOKEN_EXPIRE_SECONDS } from "../utils/constants.js";
import crypto from "crypto";

export const loginService = async (username: string, password: string) => {
  const user = await findUserByUsername(username);
  if (!user) throw new Error("Invalid credentials");

  const isValid = await comparePassword(password, user.user_password);
  if (!isValid) throw new Error("Invalid credentials");

  const accessToken = signToken({
    sub: user.id,
    role: user.role,
  });

  const rawRefreshToken = crypto.randomBytes(64).toString("hex");


  const hashedRefreshToken = hashToken(rawRefreshToken);

  await prisma.refresh_tokens.create({
    data: {
      user_id: user.id,
      token: hashedRefreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    access_token: accessToken,
    refresh_token: rawRefreshToken,
  };
};

export const registerService = async ({
  username,
  password,
  email,
  first_name,
  last_name,
}: {
  username: string;
  password: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}) => {
  const existingUser = await findUserByUsername(username);

  if (existingUser) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await hashPassword(password);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.users.create({
      data: {
        user_name: username,
        user_password: hashedPassword,
        email,
        first_name,
        last_name,
        role: "customer",
      },
    });

    await tx.customers.create({
      data: {
        user_id: user.id,
      },
    });

    return user;
  });

  const token = signToken({
    sub: result.id,
    username: result.user_name,
    role: result.role,
  });

  return {
    access_token: token,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_EXPIRE_SECONDS,
  };
};

export const refreshTokenLogic = async (rawToken: string) => {
  const hashedToken = hashToken(rawToken);

  const stored = await findRefreshTokenByHash(hashedToken);
  if (!stored) throw new Error("Invalid refresh token");

  if (stored.expires_at < new Date()) {
    await prisma.refresh_tokens.delete({ where: { token: hashedToken } });
    throw new Error("Refresh token expired");
  }

  const newRawToken = crypto.randomBytes(64).toString("hex");
  const newHashedToken = hashToken(newRawToken);

  await rotateRefreshToken(newHashedToken, hashedToken, stored);

  const newAccessToken = signToken({
    sub: stored.user_id,
  });

  return {
    access_token: newAccessToken,
    refresh_token: newRawToken
  };
};

export const logoutService = async (rawToken: string) => {
    const hashedToken = hashToken(rawToken);

    await logoutUser(hashedToken);
}