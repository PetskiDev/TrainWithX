import jwt from 'jsonwebtoken';
import { env } from '@src/utils/env';

export function generateToken(userId: number, isAdmin: boolean) {
  return jwt.sign({ sub: userId, isAdmin }, env.JWT_SECRET, {
    expiresIn: '5m',
  });
}
