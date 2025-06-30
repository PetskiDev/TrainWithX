import bcrypt from 'bcrypt';
import { prisma } from '@src/utils/prisma';
import { generateToken } from '@src/utils/jwt';
import { AppError } from '@src/utils/AppError';
import { AuthResult } from '@src/features/auth/auth.types';
import { transformUserToPreview } from '@src/features/users/user.transformer';
import { env } from '@src/utils/env';
import { sendMailFromFile } from '@src/utils/mail';
import { addMinutes } from 'date-fns';

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

  const rawToken = crypto.randomUUID();

  const expires = addMinutes(new Date(), 10); // valid for 10 minutes

  await prisma.emailVerificationToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  await prisma.emailVerificationToken.create({
    data: {
      token: rawToken,
      userId: user.id,
      expiresAt: expires,
    },
  });

  await sendMailFromFile(email, 'Confirm your email', 'verify-email', {
    name: user.username,
    link: `${env.HOST}/verify-email?token=${rawToken}`,
  });
  return {
    token: generateToken(user.id, user.isAdmin),
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

export async function verifyEmail(token: string) {
  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!record || record.expiresAt < new Date()) {
    throw new AppError('Invalid or expired token', 400);
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { isVerified: true },
    }),
    prisma.emailVerificationToken.delete({
      where: { token: record.token },
    }),
  ]);

}
