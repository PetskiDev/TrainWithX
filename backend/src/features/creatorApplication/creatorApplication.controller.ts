import { SendApplicationDTO, sendApplicationSchema } from '@trainwithx/shared';
import {
  approveCreatorApplication,
  getCreatorApplication,
  rejectCreatorApplication,
  submitCreatorApplication,
} from './creatorApplication.service.js';
import { Request, Response } from 'express';
import { AppError } from '@src/utils/AppError.js';
import { transformCreatorToPreview } from '@src/features/creators/creator.transformer.js';

export async function addCreatorApplicationController(
  req: Request,
  res: Response
) {
  const parsed = sendApplicationSchema.safeParse(req.body);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    throw new AppError(firstIssue?.message || 'Invalid data', 400);
  }

  const data = parsed.data;
  const userId = req.user!.id;
  const application = await submitCreatorApplication(userId, data);

  res.status(201).json(application);
}

//used to show the application to the user that applied
export async function getCreatorApplicationController(
  req: Request,
  res: Response
) {
  const user = req.user!;

  const application = await getCreatorApplication(user.id);

  const preview: SendApplicationDTO = {
    agreeToTerms: application.agreeToTerms as true,
    bio: application.bio,
    email: application.email,
    experience: application.experience,
    fullName: application.fullName,
    specialties: application.specialties,
    subdomain: application.subdomain,
    instagram: application.instagram ?? undefined,
    socialMedia: application.socialMedia ?? undefined,
  };

  res.status(201).json(application);
}

export async function approveCreatorApplicationController(
  req: Request,
  res: Response
) {
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
