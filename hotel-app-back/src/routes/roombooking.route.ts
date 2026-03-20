import { Router } from "express";
import * as roombookingController from "../controllers/roombooking.controller.js";

const router = Router();

router.get("/search", roombookingController.searchRooms);
router.post("/booking", roombookingController.createBooking);

export default router;