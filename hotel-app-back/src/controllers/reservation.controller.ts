import { type Request, type Response } from "express"
import * as reservationService from "../services/reservation.service.js"

export const 

getReservations = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const roomType = req.query.roomType as string;
        const paymentStatus = req.query.paymentStatus as string;
        const result = await reservationService.getAllReservations(
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
