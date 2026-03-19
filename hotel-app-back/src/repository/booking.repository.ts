import { prisma } from "../lib/prisma.js";

export const bookingFindAll = async () => {
  return prisma.booking.findMany();
};

export const bookingFindById = async (id: number) => {
  return prisma.booking.findUnique({
    where: { id },
  });
};

export const bookingItemsFindAll = async () => {
  return prisma.booking_items.findMany();
};

export const bookingAndItemsFindAll = async () => {
  return prisma.booking.findMany({
    include: {
      booking_items: true,
    },
  });
};
