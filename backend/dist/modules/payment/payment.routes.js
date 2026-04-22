"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const webhook_handler_1 = require("./webhook.handler");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const payment_schema_1 = require("./payment.schema");
const router = (0, express_1.Router)();
const paymentController = new payment_controller_1.PaymentController();
// Use express.raw for webhook endpoint
// Note: In app.ts, we already apply express.raw({ type: 'application/json' }) 
// to '/api/v1/payments/webhook' globally before express.json() is applied!
router.post('/webhook', webhook_handler_1.webhookHandler);
router.post('/create-intent', auth_middleware_1.verifyToken, (0, validate_middleware_1.validate)(payment_schema_1.createPaymentIntentSchema), paymentController.createIntent);
router.get('/status/:hackathonId', auth_middleware_1.verifyToken, paymentController.getStatus);
exports.default = router;
