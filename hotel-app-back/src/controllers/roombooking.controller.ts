import { type Request, type Response } from "express";
import * as roombookingService from "../services/roombooking.service.js";

export const searchRooms = async (req: Request, res: Response) => {
  try {
    const check_in = req.query.check_in as string;
    const check_out = req.query.check_out as string;
    const type = req.query.type as string;
    const adults = req.query.adults as string;
    const children = req.query.children as string;

    if (!check_in || !check_out) {
      return res.status(400).json({ message: "กรุณาระบุวันที่เช็คอิน (check_in) และเช็คเอาต์ (check_out)" });
    }

    const availableRooms = await roombookingService.searchRooms({
      check_in,
      check_out,
      type,
      adults,
      children
    });

    res.json(availableRooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Database error" });
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
export const getRooms = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter = (req.query.type as string) || "all";
    const sortBy = (req.query.sortBy as string) || "room_number";
    const sortOrder = (req.query.sortOrder as string) || "asc";
    const result = await roombookingService.getAllRooms(
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