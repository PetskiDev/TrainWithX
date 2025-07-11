// backend/src/features/plans/plan.controller.ts
import { Request, Response } from 'express';
import {
  fetchAllPlans,
  fetchCreatorPlans,
  fetchPlanBySlug,
  createPlanPaddleDb,
  getPlanFromSubWithSlug,
} from './plan.service';
import { AppError } from '@src/utils/AppError';
import { toPaidPlan, toPlanPreview } from './plan.transformer';

/** GET /api/v1/plans */
export async function getAllPlans(req: Request, res: Response) {
  const plans = await fetchAllPlans();
  res.json(plans.map(toPlanPreview));
}

/** GET /api/v1/creators/:username/plans */
export async function getCreatorPlans(req: Request, res: Response) {
  const { subdomain } = req.params;
  const plans = await fetchCreatorPlans(subdomain);
  res.json(plans.map(toPlanPreview));
}

/** POST /api/v1/admin/plans */
export async function createPlanAsAdmin(req: Request, res: Response) {
  const { title, description, slug, price, creatorId, originalPrice } =
    req.body;

  if (!title || !description || !slug || price === undefined || !creatorId) {
    throw new AppError(
      'title, description, slug, price and creatorId are required',
      400
    );
  }

  const plan = await createPlanPaddleDb({
    creatorId,
    title,
    description,
    slug,
    price: Number(price),
    originalPrice,
  });

  res.status(201).json(toPlanPreview(plan));
}

export async function subdomainSlugController(req: Request, res: Response) {
  const { subdomain, slug } = req.params;

  const plan = await getPlanFromSubWithSlug({ subdomain, slug });
  if (!plan) throw new AppError('Plan Not found', 404);

  res.status(200).json(toPaidPlan(plan));
}
