import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { ApiError } from '../../utils/ApiError';

const paymentService = new PaymentService();

export class PaymentController {
  async createIntent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
      }
      const { hackathonId } = req.body;
      const result = await paymentService.createPaymentIntent(hackathonId, req.user.userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
      }
      const hackathonId = req.params.hackathonId as string;
      const status = await paymentService.getPaymentStatus(hackathonId, req.user.userId);
      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }
}
