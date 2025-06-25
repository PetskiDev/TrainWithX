import { Request, Response } from 'express';
import { upgradeUser } from '@backend/features/creators/creator.service';
import { AppError } from '@backend/utils/AppError';
import { transformCreatorToPreview } from '@backend/features/creators/creator.transformer';
import { fetchAllUsers, fetchUser } from '@backend/features/users/user.service';

export const getUsers = async (req: Request, res: Response) => {
  const users = await fetchAllUsers();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) {
    throw new AppError('ID not found', 404);
  }
  const user = await fetchUser(id);
  res.json(user);
};

export const getAuthUser = async (req: Request, res: Response) => {
  const id = Number(req.user?.id);
  const user = await fetchUser(id);
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
