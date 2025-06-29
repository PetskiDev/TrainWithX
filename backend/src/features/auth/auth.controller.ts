import { Request, Response } from 'express';
import { login, register } from './auth.service';
import { AppError } from '@src/utils/AppError';
import { clearCookieOpts, cookieOpts } from '@src/utils/cookies';

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

export const logoutController = (req: Request, res: Response) => {
  res.clearCookie('access', clearCookieOpts);
  res.status(200).json({ message: 'Logged out' });
};
