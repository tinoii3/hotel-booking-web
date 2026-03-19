import { Router } from "express";
import * as manageRoomController from "../controllers/manage-room.controller.js";
import * as reservRoomController from "../controllers/reservation.controller.js";

const router = Router();

router.get("/rooms", manageRoomController.getRooms);
router.get("/get-reservations", reservRoomController.getReservations);

export default router;