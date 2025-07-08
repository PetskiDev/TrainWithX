import { Request, Response } from 'express';
import { upgradeUser } from '@src/features/creators/creator.service';
import { AppError } from '@src/utils/AppError';
import { transformCreatorToPreview } from '@src/features/creators/creator.transformer';
import {
  editUsername,
  fetchAllUsers,
  fetchUser,
  getPlansOwnedByUser,
  storeAvatar,
} from '@src/features/users/user.service';
import { toPlanPreview } from '@src/features/plans/plan.transformer';

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
  const id = Number(req.user?.id);
  const plans = await getPlansOwnedByUser(id);
  res.status(200).json(plans);
};

export const editUsernameController = async (req: Request, res: Response) => {
  const id = Number(req.user?.id);
  const newUsername = req.body.newUsername;
  if (!newUsername) {
    throw new AppError('You must supply a username', 400);
  }
  await editUsername(id, newUsername);
  res.sendStatus(200);
};

export const uploadAvatarController = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  if (!userId) throw new AppError('Unauthenticated', 401);
  if (!req.file) throw new AppError('No file uploaded', 400);

  const avatarUrl = await storeAvatar(userId, req.file);
  res.status(200).json({ avatarUrl });
};
