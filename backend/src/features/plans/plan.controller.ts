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
  getCreatorIdForPlan,
  updatePlanService,
  getPlanById,
} from './plan.service';
import { AppError } from '@src/utils/AppError';
import {
  toPaidPlan,
  toPlanPreview,
} from './plan.transformer';
import { CreatePlanDto } from '@shared/types/plan';
import { getCreatorById } from '@src/features/creators/creator.service';
import { getCompletedSet } from '@src/features/completions/completions.service';
import { checkUserPurchasedPlan } from '@src/features/checkout/checkout.service';


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
  const isCreator = await getCreatorById(user.id);

  const payload = req.body as CreatePlanDto;

  if ((!isCreator || payload.creatorId != user.id) && !user.isAdmin) {
    throw new AppError('Unauthorized to create plan', 401);
  }

  const plan = await createPlanService(payload);

  res.status(201).json(plan);
}

export async function editPlanController(req: Request, res: Response) {
  const user = req.user!;
  const planId = Number(req.params.planId);

  if (isNaN(planId)) {
    throw new AppError('Invalid Plan ID', 400);
  }

  // Fetch existing plan to validate ownership
  const creatorOfPlan = await getCreatorIdForPlan(planId);

  // Check authorization: must be admin or owner of the plan
  const isOwner = creatorOfPlan === user.id;

  if (!user.isAdmin && !isOwner) {
    throw new AppError('Unauthorized to edit this plan', 403);
  }

  const payload = req.body as CreatePlanDto;

  // Update the plan using a proper service
  const updatedPlan = await updatePlanService(planId, payload);

  res.status(200).json(updatedPlan);
}


/** GET /api/v1/creators/by-subdomain/:subdomain/plans */
export async function getPlansFromCreatorSubController(req: Request, res: Response) {
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
  const user = req.user!;
  let { subdomain, slug } = req.params;

  slug = slug.toLowerCase();
  const plan = await getPlanFromSubWithSlug({ subdomain, slug });
  if (!plan) throw new AppError('Plan Not found', 404);

  const purchased = await checkUserPurchasedPlan({ userId: user.id, planId: plan.id })
  if (!purchased) {
    throw new AppError("You don't own the plan", 403);
  }

  const completedSet = await getCompletedSet({ userId: user.id, planId: plan.id });

  res.status(200).json(toPaidPlan(plan, completedSet));
}

//for admin/creator (TODO: split to admin, okay for now)
export async function getPlanContentByIdController(req: Request, res: Response) {
  const user = req.user!;
  const planId = Number(req.params.planId);
  if (isNaN(planId)) throw new AppError('Invalid Plan ID', 400);

  const plan = await getPlanById(planId);

  if (!plan) throw new AppError('Plan not found', 404);

  const isAdmin = user.isAdmin;
  const isCreatorOwner = plan.creatorId === user.id;

  const hasAccess = isAdmin || isCreatorOwner;

  if (!hasAccess) {
    throw new AppError("You don't have access to this plan", 403);
  }
  // No completions returned for admin/creator views
  const completedSet = new Set<string>();
  res.status(200).json(toPaidPlan(plan, completedSet));
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


