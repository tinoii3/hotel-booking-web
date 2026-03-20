import { type Request, type Response } from "express";
import * as roombookingService from "../services/roombooking.service.js";

export const searchRooms = async (req: Request, res: Response) => {
  try {
    const result = await roombookingService.processSearchRooms(req.query);
    res.json(result);

  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการค้นหาห้องพัก:", error);
    res.status(400).json({
      message: error.message || "ไม่สามารถค้นหาห้องพักได้ กรุณาลองใหม่อีกครั้ง"
    });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const bookingData = req.body;
    const bookingResult = await roombookingService.createBooking(bookingData);

    res.status(201).json({
      message: "สร้างรายการจองสำเร็จ",
      data: bookingResult
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};