import * as bookingRepo from "../repository/booking.repository.js";

export const getAllBookings = async () => {
    return bookingRepo.bookingFindAll();
}

export const getBookingById = async (id: number) => {
    return bookingRepo.bookingFindById(id);
}

export const getAllBookingItems = async () => {
    return bookingRepo.bookingItemsFindAll();
}