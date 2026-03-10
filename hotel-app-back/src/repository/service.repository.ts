import { prisma } from "../lib/prisma.js";

export const findAll = async () => {
  return prisma.services.findMany();
};