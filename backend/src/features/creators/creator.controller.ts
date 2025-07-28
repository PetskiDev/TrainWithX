import { Request, Response } from 'express';

import {
  transformCreatorToPreview,
  transformToCreatorFullDTO,
} from './creator.transformer.js';
import { CreatorPostDTO, partialCreatorPostSchema } from '@trainwithx/shared';
import { AppError } from '@src/utils/AppError.js';
import {
  editCreator,
  getAllCreators,
  getCreatorById as getCreatorPreveiwById,
  getCreatorBySub,
  storeCreatorCover,
} from './creator.service.js';
import z from 'zod';

export async function getAllCreatorsPreviewController(
  req: Request,
  res: Response
) {
  const creators = await getAllCreators();
  const previews = await Promise.all(creators.map(transformCreatorToPreview));
  res.json(previews);
}

export async function getCreatorPreveiwByIdController(
  req: Request,
  res: Response
) {
  const id = Number(req.params.id);
  if (!id) {
    res.status(404).json({ error: 'Invalid Id' });
    return;
  }
  const creator = await getCreatorPreveiwById(id);
  if (!creator) {
    res.status(404).json({ error: 'Creator not found' });
    return;
  }
  const preveiw = await transformCreatorToPreview(creator);
  res.json(preveiw);
}

export async function editMyCreatorController(req: Request, res: Response) {
  const creatorId = Number(req.user?.id);
  if (!creatorId) {
    throw new AppError('Invalid Creator Id', 404);
  }
  if (creatorId !== req.user?.id && !req.user?.isAdmin) {
    throw new AppError('Unauthorized', 401);
  }
  const parsed = partialCreatorPostSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError('Invalid input', 400, z.treeifyError(parsed.error) );
  }

  const creator = await editCreator(creatorId, parsed.data);
  const preveiw = await transformCreatorToPreview(creator);
  res.json(preveiw);
}

export async function uploadCreatorCoverController(
  req: Request,
  res: Response
) {
  const creatorId = Number(req.user?.id);
  if (!creatorId) throw new AppError('Unauthenticated', 401);
  if (!req.file) throw new AppError('No file uploaded', 400);

  const coverUrl = await storeCreatorCover(creatorId, req.file);
  res.status(200).json({ coverUrl });
}

export async function getCreatorBySubController(req: Request, res: Response) {
  let { subdomain } = req.params;
  subdomain = subdomain.toLowerCase();
  const creator = await getCreatorBySub(subdomain);
  if (!creator) {
    res.status(404).json({ error: 'Creator not found' });
    return;
  }
  const preveiw = await transformCreatorToPreview(creator);
  res.json(preveiw);
}

export async function getMyCreatorController(req: Request, res: Response) {
  const id = Number(req.user?.id);
  const creator = await getCreatorPreveiwById(id);
  if (!creator) {
    throw new AppError('User is not a creator', 401);
  }
  const dto = await transformToCreatorFullDTO(creator);
  res.json(dto);
}
