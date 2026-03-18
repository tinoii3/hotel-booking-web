import { type Request, type Response } from "express";
import * as bookingService from "../services/booking.service.js";

export const getBookings = async (_req: Request, res: Response) => {
    try {
        const bookings = await bookingService.getAllBookings();
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database error" });
    }
};

export const getBookingById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const booking = await bookingService.getBookingById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database error" });
    }
}

export const getBookingItems = async (_req: Request, res: Response) => {
    try {
        const items = await bookingService.getAllBookingItems();
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database error" });
    }
}