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

export const upsertBooking = async (bookingData: any, itemsData: any[]) => {
  return prisma.$transaction(async (tx: any) => {
    const user_id = Number(bookingData.user_id);

    const existing = await findPendingBooking(tx, user_id);
    const mappedItems = mapBookingItems(itemsData);

    const cleanBookingData = {
      user_id,
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      total_price: Number(bookingData.total_price),
      total_nights: Number(bookingData.total_nights),
      total_guests: Number(bookingData.total_guests),
      first_name: bookingData.first_name,
      last_name: bookingData.last_name,
      email: bookingData.email,
      phone: bookingData.phone,
      note: bookingData.note,
      expires_at: bookingData.expires_at,
    };

    if (existing) {
      return updateBookingWithItems(
        tx,
        existing.id,
        cleanBookingData,
        mappedItems
      );
    }

    return createBooking(tx, cleanBookingData, mappedItems);
  });
};

const findPendingBooking = (tx: any, user_id: number) => {
  return tx.booking.findFirst({
    where: {
      user_id,
      status: "PENDING",
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

const createBooking = (tx: any, bookingData: any, items: any[]) => {
  return tx.booking.create({
    data: {
      ...bookingData,
      status: "PENDING",
      booking_items: {
        create: items,
      },
    },
    include: {
      booking_items: true,
    },
  });
};

const updateBookingWithItems = (
  tx: any,
  bookingId: number,
  bookingData: any,
  items: any[]
) => {
  return tx.booking.update({
    where: { id: bookingId },
    data: {
      ...bookingData,
      booking_items: {
        deleteMany: {},
        create: items,
      },
    },
    include: {
      booking_items: true,
    },
  });
};

const mapBookingItems = (itemsData: any[]) => {
  return itemsData.map((item) => ({
    room_id: Number(item.room_id),
    room_name: item.room_name,
    price_per_night: Number(item.price_per_night),
    nights: Number(item.nights),
    subtotal: Number(item.subtotal),
    adults: Number(item.adults),
    children: Number(item.children),
  }));
};