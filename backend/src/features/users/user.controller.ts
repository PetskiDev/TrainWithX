import { Request, Response } from 'express';
import { AppError } from '@src/utils/AppError.js';
import { editUsername, storeAvatar } from '@src/features/users/user.service.js';
import { getUserById } from './user.service.js';
import { usernameSchema } from '@trainwithx/shared';
import z from 'zod';

export async function getMyUserController(req: Request, res: Response) {
  const id = Number(req.user?.id);
  const user = await getUserById(id);
  res.json(user);
}

export async function editMyUsernameController(req: Request, res: Response) {
  const id = Number(req.user?.id);
  const result = usernameSchema.safeParse(req.body.newUsername);

  if (!result.success) {
    throw new AppError('Invalid username', 400, z.treeifyError(result.error));
  }
  await editUsername(id, result.data);
  res.sendStatus(200);
}

export async function uploadAvatarController(req: Request, res: Response) {
  const userId = Number(req.user?.id);
  if (!userId) throw new AppError('Unauthenticated', 401);
  if (!req.file) throw new AppError('No file uploaded', 400);

  const avatarUrl = await storeAvatar(userId, req.file);
  res.status(200).json({ avatarUrl });
}
