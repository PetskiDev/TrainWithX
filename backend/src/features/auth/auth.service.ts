import bcrypt from 'bcrypt';
import { prisma } from '@src/utils/prisma';
import { generateToken } from '@src/utils/jwt';
import { AppError } from '@src/utils/AppError';
import { AuthResult } from '@src/features/auth/auth.types';
import { transformUserToPreview } from '@src/features/users/user.transformer';

export async function register(
  email: string,
  username: string,
  password: string
): Promise<AuthResult> {
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
  const token = generateToken(user.id, user.isAdmin);

  return {
    token,
    user: transformUserToPreview(user),
  };
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid credentials.', 401);
  }

  const token = generateToken(user.id, user.isAdmin);

  return {
    token,
    user: transformUserToPreview(user),
  };
}
