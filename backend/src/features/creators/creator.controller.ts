import { Request, Response } from 'express';
import * as creatorService from './creator.service';
import { transformCreatorToPreview } from './creator.transformer';
import { AppError } from '@src/utils/AppError';

export async function getAllCreators(req: Request, res: Response) {
  const creators = await creatorService.fetchAllCreators();
  const previews = await Promise.all(creators.map(transformCreatorToPreview));
  res.json(previews);
}
export async function getByUsername(req: Request, res: Response) {
  const { subdomain } = req.params;
  const creator = await creatorService.fetchCreatorBySub(subdomain);
  if (!creator) {
    res.status(404).json({ error: 'Creator not found' });
    return;
  }
  const preveiw = await transformCreatorToPreview(creator);
  res.json(preveiw);
}
