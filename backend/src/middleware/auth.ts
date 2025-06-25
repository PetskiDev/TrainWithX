import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@backend/utils/env';
import { AppError } from '@backend/utils/AppError';

interface JwtPayload {
  sub: number;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; isAdmin: boolean };
    }
  }
}

export function doAuth(req: Request, _res: Response, next: NextFunction) {
  console.log('AUUUUU');
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401);
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as unknown as JwtPayload;
    req.user = { id: payload.sub, isAdmin: payload.isAdmin };
    next();
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
}

export function isAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user?.isAdmin) {
    return next(new AppError('Forbidden', 403));
  }
  next();
}
