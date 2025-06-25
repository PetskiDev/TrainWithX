// backend/src/features/plans/plan.controller.ts
import { Request, Response } from 'express';
import {
  fetchAllPlans,
  fetchCreatorPlans,
  fetchPlanBySlug,
  createPlanSvc,
} from './plan.service';
import { AppError } from '@backend/utils/AppError';
import { toPlanDetail, toPlanPreview } from './plan.transformer';

/** GET /api/v1/plans */
export async function getAllPlans(req: Request, res: Response) {
  const plans = await fetchAllPlans();
  res.json(plans.map(toPlanPreview));
}

/** GET /api/v1/creators/:username/plans */
export async function getCreatorPlans(req: Request, res: Response) {
  const { username } = req.params;
  const plans = await fetchCreatorPlans(username);
  res.json(plans.map(toPlanPreview));
}

/** GET /api/v1/plans/:slug */
//WITH DETAILS
export async function getPlansOfCreatorWithSlug(req: Request, res: Response) {
  const { username, slug } = req.params;
  const plan = await fetchPlanBySlug(slug);
  if (plan.creator.user.username != username) {
    res.status(404).send('Not found');
  }
  res.json(toPlanDetail(plan));
}

export async function getPlanWithSlug(req: Request, res: Response) {
  const { slug } = req.params;
  const plan = await fetchPlanBySlug(slug);
  res.json(toPlanDetail(plan));
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

  const plan = await createPlanSvc(Number(creatorId), {
    title,
    description,
    slug,
    price: Number(price),
    originalPrice,
  });

  res.status(201).json(toPlanPreview(plan));
}
