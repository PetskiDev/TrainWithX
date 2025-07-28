import bcrypt from 'bcrypt';
import { prisma } from '@src/utils/prisma.js';
import { generateToken } from '@src/utils/jwt.js';
import { AppError } from '@src/utils/AppError.js';
import { AuthResult } from '@src/features/auth/auth.types.js';
import { toUserDTO } from '@src/features/users/user.transformer.js';
import { env } from '@src/utils/env.js';
import { sendMailFromFile } from '@src/utils/mail.js';
import { addMinutes, subMinutes } from 'date-fns';
import crypto from 'node:crypto';
import { downloadImageAsMulter } from '@src/utils/downloadPicture.js';
import { storeAvatar } from '@src/features/users/user.service.js';

export async function createAndSendVerificationToken({
  userId,
  email,
  username,
}: {
  userId: number;
  email: string;
  username: string;
}) {
  // 1. Delete expired tokens
  await prisma.emailVerificationToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  // 2. Check for existing token in last 5 minutes
  const fiveMinutesAgo = subMinutes(new Date(), 5);
  const recentToken = await prisma.emailVerificationToken.findFirst({
    where: {
      userId,
      createdAt: { gt: fiveMinutesAgo },
    },
  });

  if (recentToken) {
    throw new AppError(
      'A verification email was recently sent. Please wait a few minutes before trying again.',
      429
    );
  }

  // 3. Create new token
  const rawToken = crypto.randomUUID();
  const expires = addMinutes(new Date(), 10);

  await prisma.emailVerificationToken.create({
    data: {
      token: rawToken,
      userId,
      expiresAt: expires,
    },
  });

  // 4. Send email
  await sendMailFromFile(email, 'Confirm your email', 'email-verification', {
    name: username,
    link: `${env.FRONTEND_URL}/email-verification?token=${rawToken}`,
    year: new Date().getFullYear().toString(),
  });
}

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
  const hashed = await bcrypt.hash(password, env.BCRYPT_ROUNDS);

  // 3. Create user
  const user = await prisma.user.create({
    data: { email, username, password: hashed },
  });

  // 4. Issue JWT
  await createAndSendVerificationToken({ userId: user.id, email, username });
  return {
    token: generateToken(user.id, user.isAdmin),
    user: toUserDTO(user),
  };
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  let user = await prisma.user.findUnique({
    where: { email },
  });

  //user excists but doesn't have password -> google auth
  if (user && !user.password) {
    throw new AppError('Use Google sign-in for this account.', 400);
  }

  //eather doesn't excist or wrong password.
  if (!user || !(await bcrypt.compare(password, user.password as string))) {
    throw new AppError('Invalid credentials.', 401);
  }

  const token = generateToken(user.id, user.isAdmin);

  return {
    token,
    user: toUserDTO(user),
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

export async function getUserInfoFromGoogle(code: string) {
  const body = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: `${env.API_URL}/auth/google/callback`,
    grant_type: 'authorization_code',
  }).toString();

  const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!tokenResp.ok) throw new AppError('Google token exchange failed', 502);
  const { id_token } = (await tokenResp.json()) as { id_token: string };
  const infoResp = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
  );
  if (!infoResp.ok) throw new AppError('Invalid Google ID token', 502);
  const {
    sub: googleId,
    email,
    name,
    picture,
  } = (await infoResp.json()) as {
    sub: string;
    email: string;
    name: string;
    picture?: string;
  };
  if (!email) throw new AppError('Google did not return e-mail', 400);
  return { googleId, email, name, picture };
}

export async function generateUniqueUsername(
  base: string,
  retries = 5
): Promise<string> {
  let attempt = 0;
  let username = base;
  while (await prisma.user.findUnique({ where: { username } })) {
    if (++attempt > retries)
      throw new AppError('Could not generate unique username', 500);
    const suffix = Math.floor(1000 + Math.random() * 9000);
    username = `${base}${suffix}`;
  }
  return username;
}

async function downloadAndStoreAvatar({
  userId,
  url,
}: {
  userId: number;
  url: string;
}) {
  const file = await downloadImageAsMulter({ url });
  return await storeAvatar(userId, file);
}

//IF user exicsts get the json for that
//else creates a new user with random user.
export async function getOrCreateGoogleUser({
  email,
  name,
  googleId,
  picture,
}: {
  email: string;
  name: string;
  googleId: string;
  picture?: string;
}): Promise<AuthResult> {
  let user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    // email already exists
    if (!user.googleId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { googleId, isVerified: true },
      });
    }
    //if doesn't have a picture and google has.
    if (!user.avatarUrl && picture) {
      await downloadAndStoreAvatar({ userId: user.id, url: picture });
    }
    return {
      token: generateToken(user.id, user.isAdmin),
      user: toUserDTO(user),
    };
  }

  let base = name.replace(/\s+/g, '').toLowerCase();
  let username = await generateUniqueUsername(base);

  user = await prisma.user.create({
    data: {
      email,
      username,
      password: null, // no password
      googleId: googleId, // new column if you want to track it
      isVerified: true, // Google already verified this email
    },
  });
  if (picture) {
    try {
      await downloadAndStoreAvatar({ userId: user.id, url: picture });
    } catch (e) {
      console.error('Google avatar fetch failed:', e);
    }
  }

  return {
    token: generateToken(user.id, user.isAdmin),
    user: toUserDTO(user),
  };
}
