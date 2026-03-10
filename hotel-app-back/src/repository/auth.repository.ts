import { prisma } from "../lib/prisma.js";

export const findUserByUsername = (username: string) => {
  return prisma.users.findUnique({
    where: { user_name: username }
  });
};

export const createUser = (data: any) => {
  return prisma.users.create({
    data
  });
};

export const findRefreshTokenByHash = (token: string) => {
    return prisma.refresh_tokens.findUnique({
    where: { token }
  });
};

export const rotateRefreshToken = (newHashedToken: string, hashedToken: string, stored: any) => {
    return prisma.$transaction([
    prisma.refresh_tokens.delete({
      where: { token: hashedToken }
    }),
    prisma.refresh_tokens.create({
      data: {
        user_id: stored.user_id,
        token: newHashedToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    })
  ]);
}

export const logoutUser = (hashedToken: string) => {
  return prisma.refresh_tokens.deleteMany({
    where: { token: hashedToken }
  });
}