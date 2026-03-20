import { prisma } from "../lib/prisma.js";

export const findPendingBookingByUserId = async (user_id: number) => {
  return prisma.booking.findFirst({
    where: {
      user_id,
      status: "PENDING",
    },
    include: {
      booking_items: true,
    },
    orderBy: {
      created_at: "desc",
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

export const releaseRooms = async (tx: any, bookingId: number) => {
  const items = await tx.booking_items.findMany({
    where: { booking_id: bookingId },
  });
  const roomIds = items.map((i: any) => i.room_id);
  await tx.rooms.updateMany({
    where: { id: { in: roomIds } },
    data: { status: "available" },
  });
};
