import { Request, Response } from 'express';
import { CreateReviewDTO, ReviewPreviewDTO, type UpdateReviewDTO } from '@shared/types/review';
import {
  createReview,
  deleteReview,
  getReview,
  updateReview,
} from '@src/features/reviews/review.service';
import { AppError } from '@src/utils/AppError';

export async function getReviewController(req: Request, res: Response) {
  const user = req.user!;
  const planId = Number(req.params.planId);

  if (isNaN(planId)) {
    throw new AppError('Invalid plan ID', 400);
  }

  const review: ReviewPreviewDTO = await getReview(user.id, planId);

  res.json(review);
}


export async function postReview(req: Request, res: Response) {
  const user = req.user!;
  const review = req.body as CreateReviewDTO;

  await createReview(user.id, review);

  res.status(201).json({ success: true });
}

export async function putReview(req: Request, res: Response) {
  const user = req.user!;
  const review = req.body as UpdateReviewDTO;

  await updateReview(user.id, review);

  res.status(200).json({ success: true });
}

export async function deleteReviewHandler(req: Request, res: Response) {
  const user = req.user!;
  const planId = parseInt(req.params.planId);

  await deleteReview(user.id, planId);

  res.status(200).json({ success: true });
}
