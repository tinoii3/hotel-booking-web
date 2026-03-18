import { Router } from "express";
import { getBookingById, getBookingItems, getBookings } from "../controllers/booking.controller.js";

const router = Router();
router.get("/booking", getBookings);
router.get("/booking-items", getBookingItems);
router.get("/booking/:id", getBookingById);

export default router;