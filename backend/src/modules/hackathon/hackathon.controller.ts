import { Request, Response, NextFunction } from 'express';
import { HackathonService } from './hackathon.service';
import { ApiError } from '../../utils/ApiError';

const hackathonService = new HackathonService();

export class HackathonController {
  async getHackathons(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await hackathonService.getHackathons(req.query as any);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getHackathonById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const hackathon = await hackathonService.getHackathonById(id);
      res.status(200).json({
        success: true,
        data: hackathon,
      });
    } catch (error) {
      next(error);
    }
  }

  async createHackathon(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
      }
      const hackathon = await hackathonService.createHackathon(req.body, req.user.userId);
      res.status(201).json({
        success: true,
        data: hackathon,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateHackathon(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
      }
      const id = req.params.id as string;
      const hackathon = await hackathonService.updateHackathon(id, req.body, req.user.userId);
      res.status(200).json({
        success: true,
        data: hackathon,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteHackathon(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
      }
      const id = req.params.id as string;
      const result = await hackathonService.deleteHackathon(id, req.user.userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async registerParticipant(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
      }
      const id = req.params.id as string;
      const registration = await hackathonService.registerParticipant(id, req.user.userId);
      res.status(201).json({
        success: true,
        data: registration,
      });
    } catch (error) {
      next(error);
    }
  }
}
