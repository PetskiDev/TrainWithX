// backend/src/features/plans/plan.controller.ts
import { Request, Response } from 'express';
import {
  fetchAllPlans,
  fetchCreatorPlans,
  getPlanFromSubWithSlug,
  createPlanService,
} from './plan.service';
import { AppError } from '@src/utils/AppError';
import { toPaidPlan, toPlanPreview } from './plan.transformer';
import { CreatePlanDto } from '@shared/types/plan';

/** GET /api/v1/plans */
export async function getAllPlans(req: Request, res: Response) {
  const plans = await fetchAllPlans();
  res.json(plans.map(toPlanPreview));
}

export async function createPlanController(req: Request, res: Response) {
  const user = req.user!;
  const payload = req.body as CreatePlanDto;
  if (payload.creatorId != user.id && !user.isAdmin) {
    throw new AppError('Unauthorized to create plan', 401);
  }
  const plan = await createPlanService(payload);

  res.status(201).json(plan);
}

/** GET /api/v1/creators/:username/plans */
export async function getCreatorPlans(req: Request, res: Response) {
  const { subdomain } = req.params;
  const plans = await fetchCreatorPlans(subdomain);
  res.json(plans.map(toPlanPreview));
}

export async function subdomainSlugController(req: Request, res: Response) {
  const { subdomain, slug } = req.params;

  const plan = await getPlanFromSubWithSlug({ subdomain, slug });
  if (!plan) throw new AppError('Plan Not found', 404);

  res.status(200).json(toPaidPlan(plan));
}
