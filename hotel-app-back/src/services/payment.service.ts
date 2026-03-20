import { createPayment } from "../repository/payment.repository.js";
import { prisma } from "../lib/prisma.js";
import {
  findBookingById,
  updateBooking,
} from "../repository/booking.repository.js";
import { BookingStatus } from "../utils/constants.js";
import { PaymentStatus } from "../utils/constants.js";
import * as manageRepo from "../repository/manage-room.repository.js"

export const processPaymentService = async (payload: any, userId: number) => {
  return prisma.$transaction(async (tx: any) => {
    const booking = await findBookingById(tx, payload.booking_id);

    if (!booking) throw new Error("Booking not found");

    if (booking.user_id !== userId) {
      throw new Error("Unauthorized");
    }

    if (booking.status === "CONFIRMED") {
      throw new Error("Booking already confirmed");
    }

    const updatedBooking = await updateBooking(tx, payload.booking_id, {
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone: payload.phone,
      note: payload.note,
      status: BookingStatus.CONFIRMED,
    });

    const createdPayment = await createPayment(tx, {
      booking_id: payload.booking_id,
      amount: booking.total_price,
      payment_method: payload.payment_method || "CREDIT CARD",
      status: PaymentStatus.COMPLETED,
      pay_at: new Date(),
    });

    await manageRepo.updateRoomsToOccupied(tx, payload.booking_id);

    return {
      booking: updatedBooking,
      payment: createdPayment,
    };
  });
};
