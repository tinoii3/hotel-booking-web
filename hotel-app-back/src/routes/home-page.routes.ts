import { Router } from "express";
import * as manageRoomController from "../controllers/manage-room.controller.js";

const router = Router();

router.get("/room-types-with-cover", manageRoomController.getRoomTypesWithCover);

export default router;