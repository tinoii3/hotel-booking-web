import { type Request, type Response } from "express"
import * as reservationService from "../services/reservation.service.js"

export const getReservations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const roomType = (req.query.roomType as string) || "all";
    const status = (req.query.status as string) || "all";
    const sortBy = (req.query.sortBy as string) || "created_at";
    const sortOrder = (req.query.sortOrder as string) || "desc";

    const result = await reservationService.getAllReservations(
      page,
      limit,
      roomType,
      status,
      sortBy,
      sortOrder
    );

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Database error" });
  }
};

export const updateReservationStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const result = await reservationService.updateStatus(id, status);

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Database error" });
  }
};