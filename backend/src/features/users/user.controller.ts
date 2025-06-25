import { Request, Response } from 'express';
import * as UserService from './user.service';
import { upgradeUser } from '@backend/features/creators/creator.service';
import { AppError } from '@backend/utils/AppError';
import { transformCreatorToPreview } from '@backend/features/creators/creator.transformer';

export const getUsers = async (req: Request, res: Response) => {
  const users = await UserService.fetchAllUsers();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await UserService.fetchUser(id);
  res.json(user);
};

export const promoteToCreator = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { subdomain } = req.body;

  if (!userId || !subdomain) {
    throw new AppError('userId and subdomain are required', 400);
  }
  const intId = Number(userId);

  const creator = await upgradeUser(intId, subdomain);

  const preview = transformCreatorToPreview(creator);

  res.status(201).json(preview);
};

export const getUserPlans = async (req: Request, res: Response) => {
  res.send('Constucton');
};
