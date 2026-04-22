import { Request, Response, NextFunction } from 'express';
import { TeamService } from './team.service';
import { ApiError } from '../../utils/ApiError';

const teamService = new TeamService();

export class TeamController {
  async createTeam(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
      }
      const team = await teamService.createTeam(req.body, req.user.userId);
      res.status(201).json({
        success: true,
        data: team,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTeamById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const team = await teamService.getTeamById(id);
      
      // Don't expose invite token to non-members
      const isMember = req.user && team.members.some(m => m.userId === req.user?.userId);
      if (!isMember) {
        (team as any).inviteToken = undefined;
      }

      res.status(200).json({
        success: true,
        data: team,
      });
    } catch (error) {
      next(error);
    }
  }

  async inviteMember(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
      }
      const id = req.params.id as string;
      const result = await teamService.inviteMember(id, req.body, req.user.userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async joinTeam(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
      }
      const result = await teamService.joinTeam(req.body, req.user.userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
