import { Request, Response } from 'express';
import {
  askGoogle,
  login,
  register,
  getOrCreateGoogleUser,
  verifyEmail,
} from './auth.service';
import { AppError } from '@src/utils/AppError';
import { clearCookieOpts, cookieOpts } from '@src/utils/cookies';
import querystring from 'node:querystring';
import { env } from '@src/utils/env';

export const registerController = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    throw new AppError('Email, username, and password are required.', 400);
  }

  const result = await register(email, username, password);

  //JWT TOKEN NOT VISIBLE TO JS. SEND JUST THE INFO THAT THE FRONTEND NEEDS
  //TOKEN IS HANDLED BY BROWSER.
  //sending just the UserDTO
  res.cookie('access', result.token, cookieOpts).status(201).json(result.user);
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError('Email, and password are required.', 400);
  }
  const result = await login(email, password);
  res.cookie('access', result.token, cookieOpts).status(200).json(result.user);
};

export const logoutController = async (req: Request, res: Response) => {
  res.clearCookie('access', clearCookieOpts);
  res.status(200).json({ message: 'Logged out' });
};

export const verifyController = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) throw new AppError('Token required', 400);

  await verifyEmail(token);

  res.json({
    ok: true,
    message: 'Email successfully verified.',
  });
};

export const googleController = async (req: Request, res: Response) => {
  const qs = querystring.stringify({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: `${env.API_URL}/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${qs}`);
};

export const googleCallbackController = async (req: Request, res: Response) => {
  //get the auth code
  const code = req.query.code as string | undefined;
  if (!code) throw new AppError('Missing OAuth code', 400);

  //use the code to ask google for the user
  const { googleId, email, name } = await askGoogle(code);

  const result = await getOrCreateGoogleUser({
    googleId,
    email,
    name,
  });

  //google redirects to me, with cookie it hydrates.
  res
    .cookie('access', result.token, cookieOpts)
    .redirect(`${env.FRONTEND_URL}/me`);
};
