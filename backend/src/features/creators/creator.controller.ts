import { Request, Response } from 'express';
import * as creatorService from './creator.service';
import { transformCreatorToPreview } from './creator.transformer';
import { AppError } from '@src/utils/AppError';
import { CreatorApplicationDTO } from '@shared/types/creator';

export async function getAllCreators(req: Request, res: Response) {
  const creators = await creatorService.fetchAllCreators();
  const previews = await Promise.all(creators.map(transformCreatorToPreview));
  res.json(previews);
}

export async function postCreatorApplication(req: Request, res: Response) {
  const data = req.body as CreatorApplicationDTO;
  const user = req.user!;
  const application = await creatorService.submitCreatorApplication(
    user.id,
    data
  );

  res.status(201).json(application);
}

export async function getById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id) {
    res.status(404).json({ error: 'Invalid Id' });
    return;
  }
  const creator = await creatorService.fetchCreatorById(id);
  if (!creator) {
    res.status(404).json({ error: 'Creator not found' });
    return;
  }
  const preveiw = await transformCreatorToPreview(creator);
  res.json(preveiw);
}

export async function getBySubdomain(req: Request, res: Response) {
  let { subdomain } = req.params;
  subdomain = subdomain.toLowerCase();
  const creator = await creatorService.fetchCreatorBySub(subdomain);
  if (!creator) {
    res.status(404).json({ error: 'Creator not found' });
    return;
  }
  const preveiw = await transformCreatorToPreview(creator);
  res.json(preveiw);
}
