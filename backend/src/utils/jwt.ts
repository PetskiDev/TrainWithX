import jwt from 'jsonwebtoken';
import { env } from '@src/utils/env';

export interface JwtPayload {
  sub: number;
  isAdmin: boolean;
  iat: number;
  exp: number;
}


export function generateToken(userId: number, isAdmin: boolean) {
  return jwt.sign({ sub: userId, isAdmin }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
}

