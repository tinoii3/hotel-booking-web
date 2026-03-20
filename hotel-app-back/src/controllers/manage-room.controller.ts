import { type Request, type Response } from "express";
import * as manageRoomService from "../services/manage-room.service.js";

export const getRooms = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter = (req.query.type as string) || "all";
    const sortBy = (req.query.sortBy as string) || "room_number";
    const sortOrder = (req.query.sortOrder as string) || "asc";
    const result = await manageRoomService.getAllRooms(
      page,
      limit,
      filter,
      sortBy,
      sortOrder,
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mesage: "Database error" });
  }
};

export const getRoomTypesWithCover = async (_req: Request, res: Response) => {
  try {
    const types = await manageRoomService.getAllRoomTypesWithCover();
    res.json(types);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Database error" });
  }
};

export const getRoomTypes = async (_req: Request, res: Response) => {
  try {
    const types = await manageRoomService.getAllRoomTypes();
    res.json(types);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Database error" });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const roomData = req.body;
    if (Array.isArray(roomData)) {
      const newRooms = await manageRoomService.createManyRooms(roomData);
      res
        .status(201)
        .json({ message: `เพิ่มข้อมูลสำเร็จจำนวน ${newRooms.count} ห้อง` });
    } else {
      const newRoom = await manageRoomService.createRoom(roomData);
      res.status(201).json(newRoom);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create room" });
  }
};

export const createRoomType = async (req: Request, res: Response) => {
  try {
    const typeDate = req.body;
    const newType = await manageRoomService.createRoomType(typeDate);
    res.status(201).json(newType);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create room type" });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const roomData = req.body;
    const updateRoom = await manageRoomService.updateRoom(id, roomData);
    res.json(updateRoom);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update room" });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.id as string, 10);
    if (isNaN(roomId)) {
      return res.status(400).json({ message: "ID ห้องพักไม่ถูกต้อง" });
    }
    await manageRoomService.deleteRoomWithImages(roomId);
    res.json({ message: "Room delete successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete room" });
  }
};

export const deleteRoomType = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await manageRoomService.removeRoomType(id);
    res.json({ message: "ลบประเภทห้องสำเร็จ" });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "ไม่สามารถลบประเภทห้องได้" });
  }
};

export const uploadRoomImages = async (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.id as string, 10);
    const files = req.files as Express.Multer.File[];
    const coverIndex = parseInt(req.body.coverIndex || "-1", 10);
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "ไม่มีไฟล์รูปภาพถูกอัปโหลดมา" });
    }
    await manageRoomService.saveRoomImages(roomId, files, coverIndex);
    res.json({ message: "อัปโหลดรูปภาพสำเร็จ!" });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ:", error);
    res.status(500).json({ message: "บันทึกรูปภาพไม่สำเร็จ" });
  }
};

export const deleteRoomImage = async (req: Request, res: Response) => {
  try {
    const imageId = parseInt(req.params.imageId as string, 10);
    await manageRoomService.deleteRoomImage(imageId);
    res.json({ message: "ลบรูปภาพสำเร็จ" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ลบรูปภาพไม่สำเร็จ" });
  }
};

export const setCoverImage = async (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.roomId as string, 10);
    const imageId = parseInt(req.params.imageId as string, 10);
    await manageRoomService.updateCoverImage(roomId, imageId);
    res.json({ message: "อัปเดตหน้าปกสำเร็จ" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "อัปเดตหน้าปกไม่สำเร็จ" });
  }
};
