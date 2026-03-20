import { type Request, type Response } from "express";
import * as bookingService from "../services/booking.service.js";


export const findPendingBookingByUserId = async (req: Request, res: Response) => {
  try {
    const user_id = parseInt(req.params.user_id as string, 10);
    const booking = await bookingService.findPendingBookingByUserId(user_id);

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

