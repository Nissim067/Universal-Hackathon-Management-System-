"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookHandler = void 0;
const stripe_1 = require("../../config/stripe");
const env_1 = require("../../config/env");
const db_1 = require("../../config/db");
const logger_1 = require("../../utils/logger");
const webhookHandler = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
        return res.status(400).send('Webhook Error: Missing stripe-signature header');
    }
    let event;
    try {
        // Stripe requires the raw body to construct the event
        event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, env_1.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        logger_1.logger.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const stripePaymentId = paymentIntent.id;
            await db_1.db.payment.updateMany({
                where: { stripePaymentId },
                data: { status: 'SUCCEEDED' },
            });
            logger_1.logger.info(`Payment succeeded: ${stripePaymentId}`);
        }
        else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            const stripePaymentId = paymentIntent.id;
            await db_1.db.payment.updateMany({
                where: { stripePaymentId },
                data: { status: 'FAILED' },
            });
            logger_1.logger.info(`Payment failed: ${stripePaymentId}`);
        }
        res.json({ received: true });
    }
    catch (error) {
        logger_1.logger.error(`Error processing webhook: ${error instanceof Error ? error.message : String(error)}`);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
};
exports.webhookHandler = webhookHandler;
