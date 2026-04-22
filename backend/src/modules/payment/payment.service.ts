import { db } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import { stripe } from '../../config/stripe';

export class PaymentService {
  async createPaymentIntent(hackathonId: string, userId: string) {
    const hackathon = await db.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!hackathon) {
      throw new ApiError(404, 'Hackathon not found', 'HACKATHON_NOT_FOUND');
    }

    if (hackathon.registrationFee <= 0) {
      throw new ApiError(400, 'This hackathon is free, no payment required', 'PAYMENT_NOT_REQUIRED');
    }

    // Check if user already paid
    const existingPayment = await db.payment.findFirst({
      where: {
        userId,
        hackathonId,
        status: 'SUCCEEDED',
      },
    });

    if (existingPayment) {
      throw new ApiError(409, 'Payment already completed for this hackathon', 'ALREADY_PAID');
    }

    // Amount in paise
    const amount = hackathon.registrationFee * 100;
    const currency = 'inr';

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        userId,
        hackathonId,
      },
    });

    // Create a pending payment record
    await db.payment.create({
      data: {
        userId,
        hackathonId,
        stripePaymentId: paymentIntent.id,
        amount: hackathon.registrationFee,
        currency,
        status: 'PENDING',
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      amount: hackathon.registrationFee,
      currency,
    };
  }

  async getPaymentStatus(hackathonId: string, userId: string) {
    const payment = await db.payment.findFirst({
      where: {
        userId,
        hackathonId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!payment) {
      throw new ApiError(404, 'No payment found for this hackathon', 'PAYMENT_NOT_FOUND');
    }

    return {
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      createdAt: payment.createdAt,
    };
  }
}
