import { Request, Response } from 'express';
import { AppError } from '@src/utils/AppError.js';
import {
  editUsername,
  storeAvatar,
} from '@src/features/users/user.service.js';
import { getUserById } from './user.service.js';


export async function getMyUserController(req: Request, res: Response) {
  const id = Number(req.user?.id);
  const user = await getUserById(id);
  res.json(user);
}


export async function editMyUsernameController(req: Request, res: Response) {
  const id = Number(req.user?.id);
  const newUsername = req.body.newUsername;
  if (!newUsername) {
    throw new AppError('You must supply a username', 400);
  }
  await editUsername(id, newUsername);
  res.sendStatus(200);
}

export async function uploadAvatarController(req: Request, res: Response) {
  const userId = Number(req.user?.id);
  if (!userId) throw new AppError('Unauthenticated', 401);
  if (!req.file) throw new AppError('No file uploaded', 400);

  const avatarUrl = await storeAvatar(userId, req.file);
  res.status(200).json({ avatarUrl });
}
