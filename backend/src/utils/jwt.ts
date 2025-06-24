import jwt from 'jsonwebtoken';
import { env } from '@backend/utils/env';

export function generateToken(userId: number) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: '5m' });
}
