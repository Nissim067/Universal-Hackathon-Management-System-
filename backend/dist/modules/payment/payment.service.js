"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const db_1 = require("../../config/db");
const ApiError_1 = require("../../utils/ApiError");
const stripe_1 = require("../../config/stripe");
class PaymentService {
    async createPaymentIntent(hackathonId, userId) {
        const hackathon = await db_1.db.hackathon.findUnique({
            where: { id: hackathonId },
        });
        if (!hackathon) {
            throw new ApiError_1.ApiError(404, 'Hackathon not found', 'HACKATHON_NOT_FOUND');
        }
        if (hackathon.registrationFee <= 0) {
            throw new ApiError_1.ApiError(400, 'This hackathon is free, no payment required', 'PAYMENT_NOT_REQUIRED');
        }
        // Check if user already paid
        const existingPayment = await db_1.db.payment.findFirst({
            where: {
                userId,
                hackathonId,
                status: 'SUCCEEDED',
            },
        });
        if (existingPayment) {
            throw new ApiError_1.ApiError(409, 'Payment already completed for this hackathon', 'ALREADY_PAID');
        }
        // Amount in paise
        const amount = hackathon.registrationFee * 100;
        const currency = 'inr';
        const paymentIntent = await stripe_1.stripe.paymentIntents.create({
            amount,
            currency,
            metadata: {
                userId,
                hackathonId,
            },
        });
        // Create a pending payment record
        await db_1.db.payment.create({
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
    async getPaymentStatus(hackathonId, userId) {
        const payment = await db_1.db.payment.findFirst({
            where: {
                userId,
                hackathonId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (!payment) {
            throw new ApiError_1.ApiError(404, 'No payment found for this hackathon', 'PAYMENT_NOT_FOUND');
        }
        return {
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            createdAt: payment.createdAt,
        };
    }
}
exports.PaymentService = PaymentService;
