import { Router } from "express";
import * as manageRoomController from "../controllers/manage-room.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/rooms", manageRoomController.getRooms);
router.get("/room-types", manageRoomController.getRoomTypes);
router.get("/room-types-with-cover", manageRoomController.getRoomTypesWithCover);
router.post("/rooms", manageRoomController.createRoom);
router.post("/room-types", manageRoomController.createRoomType);
router.patch("/rooms/:id", manageRoomController.updateRoom);
router.delete("/rooms/:id", manageRoomController.deleteRoom);
router.post('/rooms/:id/images', upload.array('images', 10), manageRoomController.uploadRoomImages);
router.delete('/rooms/images/:imageId', manageRoomController.deleteRoomImage);
router.put('/rooms/:roomId/images/:imageId/set-cover', manageRoomController.setCoverImage);

export default router;