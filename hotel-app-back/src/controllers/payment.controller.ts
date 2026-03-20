import * as paymentService from "../services/payment.service.js";
import { Request, Response } from 'express';

export const processPaymentController = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const user_id = (req as any).user.sub;

    const result = await paymentService.processPaymentService(payload, user_id);

    return res.status(200).json({
      message: 'Payment successful',
      data: result,
    });

  } catch (error: any) {

    console.error('Payment error:', error);

    return res.status(400).json({
      message: error.message || 'Payment failed',
    });
  }
};