import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      code: 'VALIDATION_ERROR',
      errors: err.issues,
    });
  }

  logger.error(err);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    code: 'INTERNAL_SERVER_ERROR',
  });
};
