import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { webhookHandler } from './webhook.handler';
import { validate } from '../../middleware/validate.middleware';
import { verifyToken } from '../../middleware/auth.middleware';
import { createPaymentIntentSchema } from './payment.schema';

const router = Router();
const paymentController = new PaymentController();

// Use express.raw for webhook endpoint
// Note: In app.ts, we already apply express.raw({ type: 'application/json' }) 
// to '/api/v1/payments/webhook' globally before express.json() is applied!
router.post('/webhook', webhookHandler);

router.post('/create-intent', verifyToken, validate(createPaymentIntentSchema), paymentController.createIntent);
router.get('/status/:hackathonId', verifyToken, paymentController.getStatus);

export default router;
