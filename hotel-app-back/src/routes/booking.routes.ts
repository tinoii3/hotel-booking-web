import { Router } from "express";
import { findPendingBookingByUserId } from "../controllers/booking.controller.js";

const router = Router();
router.get("/booking-pending/:user_id", findPendingBookingByUserId);

export default router;