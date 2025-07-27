import { Request, Response } from 'express';
import { AppError } from '@src/utils/AppError.js';
import { CreateCompletionDTO } from '@trainwithx/shared';
import { checkUserPurchasedPlan } from '@src/features/checkout/checkout.service.js';
import { createCompletion } from '@src/features/completions/completions.service.js';

export async function createCompletionController(req: Request, res: Response) {
  const userId = req.user!.id;
  const { planId, weekId, dayId } = req.body as CreateCompletionDTO;

  if (!planId || !weekId || !dayId) {
    throw new AppError('Missing planId, weekId, or dayId', 400);
  }

  const purchased = await checkUserPurchasedPlan({ userId, planId });

  if (!purchased) {
    throw new AppError("Unauthorized, you don't own the plan", 401);
  }

  const completion = await createCompletion({
    userId,
    planId,
    weekId,
    dayId,
  });

  res.status(201).json(completion);
}
