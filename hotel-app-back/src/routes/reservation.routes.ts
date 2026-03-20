import { Router } from "express";
import * as reservationController from "../controllers/reservation.controller.js";

const router = Router();

router.get("/get-reservations", reservationController.getReservations);
router.patch("/:id/status", reservationController.updateReservationStatus);

export default router;