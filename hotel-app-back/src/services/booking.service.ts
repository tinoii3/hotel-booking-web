import * as bookingRepo from "../repository/booking.repository.js";


export const findPendingBookingByUserId = async (user_id: number) => {
    return bookingRepo.findPendingBookingByUserId(user_id);
}