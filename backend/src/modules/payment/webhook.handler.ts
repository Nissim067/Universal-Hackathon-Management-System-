import { Request, Response } from 'express';
import { stripe } from '../../config/stripe';
import { env } from '../../config/env';
import { db } from '../../config/db';
import { logger } from '../../utils/logger';

export const webhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('Webhook Error: Missing stripe-signature header');
  }

  let event;

  try {
    // Stripe requires the raw body to construct the event
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    logger.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as any;
      const stripePaymentId = paymentIntent.id;

      await db.payment.updateMany({
        where: { stripePaymentId },
        data: { status: 'SUCCEEDED' },
      });
      logger.info(`Payment succeeded: ${stripePaymentId}`);

    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as any;
      const stripePaymentId = paymentIntent.id;

      await db.payment.updateMany({
        where: { stripePaymentId },
        data: { status: 'FAILED' },
      });
      logger.info(`Payment failed: ${stripePaymentId}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error(`Error processing webhook: ${error instanceof Error ? error.message : String(error)}`);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};
