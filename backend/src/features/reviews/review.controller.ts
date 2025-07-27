import { Request, Response } from 'express';
import {
  CreateReviewDTO,
  ReviewPreviewDTO,
  type UpdateReviewDTO,
} from '@trainwithx/shared';
import {
  createReview,
  deleteReview,
  getCreatorReviews as getReviewsOfCreator,
  getReview,
  updateReview,
  getReviewsOfPlan,
} from '@src/features/reviews/review.service';
import { AppError } from '@src/utils/AppError';

export async function getMyReviewForPlanController(
  req: Request,
  res: Response
) {
  const user = req.user!;
  const planId = Number(req.params.planId);

  if (isNaN(planId)) {
    throw new AppError('Invalid plan ID', 400);
  }

  const review: ReviewPreviewDTO = await getReview(user.id, planId);

  res.json(review);
}

export async function createReviewController(req: Request, res: Response) {
  const user = req.user!;
  const review = req.body as CreateReviewDTO;

  await createReview(user.id, review);

  res.status(201).json({ success: true });
}

export async function updateReviewController(req: Request, res: Response) {
  const user = req.user!;
  const review = req.body as UpdateReviewDTO;

  await updateReview(user.id, review);

  res.status(200).json({ success: true });
}

export async function deleteReviewController(req: Request, res: Response) {
  const user = req.user!;
  const planId = parseInt(req.params.planId);

  await deleteReview(user.id, planId);

  res.status(200).json({ success: true });
}

export async function getReviewsOfCreatorController(
  req: Request,
  res: Response
) {
  const creatorId = Number(req.params.creatorId);

  if (!creatorId) {
    throw new AppError('Invalid Creator Id', 404);
  }

  const reviews = await getReviewsOfCreator(creatorId);

  res.json(reviews);
}
export async function getReviewsOfPlanController(req: Request, res: Response) {
  const planId = Number(req.params.planId);

  if (!planId) {
    throw new AppError('Invalid Plan Id', 404);
  }

  const reviews = await getReviewsOfPlan(planId);

  res.json(reviews);
}
