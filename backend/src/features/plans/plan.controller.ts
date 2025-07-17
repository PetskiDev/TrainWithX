// backend/src/features/plans/plan.controller.ts
import { Request, Response } from 'express';
import {
  getAllPlans,
  fetchCreatorPlans,
  getPlanFromSubWithSlug,
  createPlanService,
  deletePlanWithId,
  getPlansMadeByCreator,
  getPlansOwnedByUser,
} from './plan.service';
import { AppError } from '@src/utils/AppError';
import {
  toPaidPlan,
  toPlanPreview,
} from './plan.transformer';
import { CreatePlanDto } from '@shared/types/plan';


export async function getAllPlansPreview(req: Request, res: Response) {
  const plans = await getAllPlans();
  res.json(plans.map(toPlanPreview));
}

export async function deletePlanController(req: Request, res: Response) {
  const planId = Number(req.params.planId);
  if (isNaN(planId)) {
    throw new AppError('Invalid Plan Id', 400);
  }
  await deletePlanWithId(planId);
  res.sendStatus(200);
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
export async function getCreatorPlansController(req: Request, res: Response) {
  const { subdomain } = req.params;
  const plans = await fetchCreatorPlans(subdomain);
  res.json(plans.map(toPlanPreview));
}

export async function getPlanSubSlugPreveiw(req: Request, res: Response) {
  let { subdomain, slug } = req.params;
  slug = slug.toLowerCase();
  const plan = await getPlanFromSubWithSlug({ subdomain, slug });
  if (!plan) throw new AppError('Plan Not found', 404);

  res.status(200).json(toPlanPreview(plan));
}

export async function getPlanSubSlugContent(req: Request, res: Response) {
  let { subdomain, slug } = req.params;
  slug = slug.toLowerCase();
  const plan = await getPlanFromSubWithSlug({ subdomain, slug });
  if (!plan) throw new AppError('Plan Not found', 404);

  res.status(200).json(toPaidPlan(plan));
}

export async function getMyCreatedPlansController(req: Request, res: Response) {
  const creatorId = Number(req.user?.id);
  const plans = await getPlansMadeByCreator(creatorId);
  res.status(200).json(plans);
};
export async function getMyPurchasedPlansController(req: Request, res: Response) {
  const id = Number(req.user?.id);
  const plans = await getPlansOwnedByUser(id);
  res.status(200).json(plans);
}


