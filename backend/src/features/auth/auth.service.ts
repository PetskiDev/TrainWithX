import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@backend/utils/prisma';
import { env } from '@backend/utils/env';
import { generateToken } from '@backend/utils/jwt';
import { AppError } from '@backend/utils/AppError';
import { LoginResponse } from '@shared/types/auth';

export async function register(
  email: string,
  username: string,
  password: string
) {
  // 1. Check if user exists
  let existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already in use.', 409);
  existing = await prisma.user.findUnique({ where: { username } });
  if (existing) throw new AppError('Username already in use.', 409);

  // 2. Hash password
  const hashed = await bcrypt.hash(password, 10);

  // 3. Create user
  const user = await prisma.user.create({
    data: { email, username, password: hashed },
  });

  // 4. Issue JWT
  const token = generateToken(user.id);

  return { token, userId: user.id };
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid credentials.', 401);
  }

  const token = generateToken(user.id);

  return { token, userId: user.id, username: user.username };
}
