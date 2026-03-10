import { Router } from "express";
import * as manageRoomController from "../controllers/manage-room.controller.js";

const router = Router();

router.get("/rooms", manageRoomController.getRooms);
router.get("/room-types", manageRoomController.getRoomTypes);
router.post("/rooms", manageRoomController.createRoom);
router.post("/room-types", manageRoomController.createRoomType);
router.patch("rooms/:id", manageRoomController.updateRoom);
router.delete("rooms/:id", manageRoomController.deleteRoom);

export default router;