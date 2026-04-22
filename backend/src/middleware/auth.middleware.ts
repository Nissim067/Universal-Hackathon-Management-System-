import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JWTPayload } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, 'Invalid or expired token', 'UNAUTHORIZED'));
    }
  }
};

export const requireRole = (role: 'PARTICIPANT' | 'ORGANIZER' | 'ADMIN') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized', 'UNAUTHORIZED'));
    }

    if (req.user.role !== role && req.user.role !== 'ADMIN') {
      return next(new ApiError(403, 'Forbidden', 'FORBIDDEN'));
    }

    next();
  };
};
