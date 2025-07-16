import { Request, Response } from 'express';
import { CreateReviewDTO, type UpdateReviewDTO } from '@shared/types/review';
import {
  createReview,
  deleteReview,
  updateReview,
} from '@src/features/reviews/review.service';

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
