import { Router } from "express";
import * as roombookingController from "../controllers/roombooking.controller.js";

const router = Router();

router.get("/search", roombookingController.searchRooms);
router.get("/rooms", roombookingController.getRooms);
router.post("/book", roombookingController.createBooking);

export default router;