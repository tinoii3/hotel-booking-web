import { RoomStatus } from "../utils/constants.js";

export const createPayment = (tx: any, data: any) => {
  return tx.payments.create({ data });
};

export const updateRoomsToReserved = async (tx: any, bookingId: number) => {
  const items = await tx.booking_items.findMany({
    where: { booking_id: bookingId }
  });

  const roomIds = items.map((item: any) => item.room_id);

  await tx.rooms.updateMany({
    where: {
      id: { in: roomIds },
      status: RoomStatus.available
    },
    data: {
      status: RoomStatus.reserved
    }
  });
};