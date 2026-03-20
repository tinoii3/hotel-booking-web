import { Router } from 'express';
import { processPayment, cancelBooking} from '../controllers/payment.controller.js';

const router = Router();

router.post('/create-payment', processPayment);
router.post('/:id/cancel', cancelBooking);

export default router;