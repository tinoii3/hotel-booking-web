import { type Request, type Response } from "express"
import * as manageRoomService from "../services/manage-room.service.js"
import * as reservRoomService from "../services/reserv-room.service.js"

export const 

getReservations = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const roomType = req.query.roomType as string;
        const paymentStatus = req.query.paymentStatus as string;
        const result = await reservRoomService.getAllReservations(
            page,
            limit,
            roomType,
            paymentStatus
        );
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Database error" });
    }
}

export const getRoomTypes = async (_req: Request, res: Response) => {
    try {
        const types = await manageRoomService.getAllRoomTypes();
        res.json(types);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Database error" });
    }
}