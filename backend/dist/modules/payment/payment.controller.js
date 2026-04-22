"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const ApiError_1 = require("../../utils/ApiError");
const paymentService = new payment_service_1.PaymentService();
class PaymentController {
    async createIntent(req, res, next) {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
            }
            const { hackathonId } = req.body;
            const result = await paymentService.createPaymentIntent(hackathonId, req.user.userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getStatus(req, res, next) {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
            }
            const hackathonId = req.params.hackathonId;
            const status = await paymentService.getPaymentStatus(hackathonId, req.user.userId);
            res.status(200).json({
                success: true,
                data: status,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PaymentController = PaymentController;
