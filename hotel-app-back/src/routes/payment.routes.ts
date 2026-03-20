import { Router } from 'express';
import { processPaymentController } from '../controllers/payment.controller.js';

const router = Router();

router.post('/create-payment', processPaymentController);

export default router;