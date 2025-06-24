import { Request, Response } from 'express';
import { login, register } from './auth.service';
import { AppError } from '@backend/utils/AppError';

export const registerController = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    throw new AppError('Email, username, and password are required.', 400);
  }
  const result = await register(email, username, password);
  res.status(201).json(result);
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError('Email, and password are required.', 400);
  }
  const result = await login(email, password);
  res.json(result);
};
