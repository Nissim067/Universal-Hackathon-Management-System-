import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '@prisma/client';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export const generateTokens = (payload: JWTPayload) => {
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JWTPayload;
};
