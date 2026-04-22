import { Request, Response, NextFunction } from 'express';
import { SubmissionService } from './submission.service';
import { ApiError } from '../../utils/ApiError';

const submissionService = new SubmissionService();

export class SubmissionController {
  async createSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
      }
      const submission = await submissionService.createSubmission(req.body, req.user.userId);
      res.status(201).json({
        success: true,
        data: submission,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const hackathonId = req.params.hackathonId as string;
      const submissions = await submissionService.getSubmissionsByHackathonId(hackathonId);
      res.status(200).json({
        success: true,
        data: submissions,
      });
    } catch (error) {
      next(error);
    }
  }
}
