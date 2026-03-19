import { Router } from "express";
import { getAllBookingsAndItems, getBookingFindByUserId, getBookingItems, getBookings } from "../controllers/booking.controller.js";

const router = Router();
router.get("/booking", getBookings);
router.get("/booking-items", getBookingItems);
router.get("/booking/:user_id", getBookingFindByUserId);
router.get("/booking-with-items", getAllBookingsAndItems);

export default router;