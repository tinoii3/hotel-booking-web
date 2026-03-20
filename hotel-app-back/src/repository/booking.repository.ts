import { prisma } from "../lib/prisma.js";

export const findPendingBookingByUserId = async (user_id: number) => {
  return prisma.booking.findFirst({
    where: {
      user_id,
      status: 'PENDING',
    },
    include: {
      booking_items: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
};

export const findBookingById = (tx: any, id: number) => {
  return tx.booking.findUnique({ where: { id } });
};

export const updateBooking = (tx: any, id: number, data: any) => {
  return tx.booking.update({
    where: { id },
    data,
  });
};