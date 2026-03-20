import * as paymentService from "../services/payment.service.js";
import { Request, Response } from "express";

export const processPayment = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const user_id = (req as any).user.sub;

    const result = await paymentService.processPayment(payload, user_id);

    return res.status(200).json({
      message: "Payment successful",
      data: result,
    });
  } catch (error: any) {
    console.error("Payment error:", error);

    return res.status(400).json({
      message: error.message || "Payment failed",
    });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.sub;
    const bookingId = parseInt(req.params.id as string, 10);
    const result = await paymentService.cancelBooking(bookingId, userId);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
