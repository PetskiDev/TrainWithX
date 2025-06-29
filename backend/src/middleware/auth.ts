import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@src/utils/env';
import { AppError } from '@src/utils/AppError';

import type { JwtPayload } from '@src/utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; isAdmin: boolean };
    }
  }
}

export function doAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.access; // ← only cookie
  console.log('AUUUTHH');
  if (!token) throw new AppError('Unauthorized', 401);

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
