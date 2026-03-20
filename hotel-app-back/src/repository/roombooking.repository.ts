import { prisma } from "../lib/prisma.js";

export const searchAvailableRooms = async (
  whereCondition: any
) => {
  return prisma.rooms.findMany({
    where: whereCondition,
    include: {
      room_types: true,
      room_images: true,
    },
    orderBy: { room_number: 'asc' }
  });
};

export const createBookingRecord = async (bookingData: any, itemsData: any[]) => {
  return prisma.booking.create({
    data: {
      user_id: Number(bookingData.user_id),
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      total_price: Number(bookingData.total_price),
      total_nights: Number(bookingData.total_nights),
      total_guests: Number(bookingData.total_guests),
      status: "PENDING",

      first_name: bookingData.first_name,
      last_name: bookingData.last_name,
      email: bookingData.email,
      phone: bookingData.phone,
      note: bookingData.note,
      expires_at: bookingData.expires_at,

      booking_items: {
        create: itemsData.map((item) => ({
          room_id: Number(item.room_id),
          room_name: item.room_name,
          price_per_night: Number(item.price_per_night),
          nights: Number(item.nights),
          subtotal: Number(item.subtotal),
          adults: Number(item.adults),
          children: Number(item.children),
        })),
      },
    },
    include: {
      booking_items: true,
    },
  });
};