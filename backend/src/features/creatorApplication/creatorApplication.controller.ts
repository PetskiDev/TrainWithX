import { SendApplicationDTO } from '@shared/types/creator';
import { approveCreatorApplication, rejectCreatorApplication, submitCreatorApplication } from './creatorApplication.service';
import { Request, Response } from 'express';
import { AppError } from '@src/utils/AppError';
import { transformCreatorToPreview } from '@src/features/creators/creator.transformer';


export async function addCreatorApplicationController(req: Request, res: Response) {
  const data = req.body as SendApplicationDTO;
  const userId = req.user!.id;
  const application = await submitCreatorApplication(
    userId,
    data
  );

  res.status(201).json(application);
}

export async function approveCreatorApplicationController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id) throw new AppError('Invalid application ID', 400);

  const creator = await approveCreatorApplication(id);

  const preview = await transformCreatorToPreview(creator);
  res.status(200).json(preview);
}

export async function rejectApplicationController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id) throw new AppError('Invalid application ID', 400);

  await rejectCreatorApplication(id);

  res.sendStatus(200);
}

