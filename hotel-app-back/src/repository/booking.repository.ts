import { prisma } from "../lib/prisma.js";

export const bookingFindAll = async () => {
  return prisma.booking.findMany();
};

export const bookingFindByUserId = async (user_id: number) => {
  return prisma.booking.findMany({
    include: {
      booking_items: true,
    },
    where: { user_id: user_id },
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
