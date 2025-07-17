import { Request, Response, Router } from 'express';

import { doAuth } from '@src/middleware/auth';
import { deleteReviewController, getMyReviewForPlanController, createReviewController, updateReviewController } from '@src/features/reviews/review.controller';
import { getReviewsOfPlan } from '@src/features/reviews/review.service';
import { AppError } from '@src/utils/AppError';

const router = Router();

//Get all reviews of some plan
router.get('/all/:planId'); //TODO

//Get the review of the logged in user to the plan
router.get('/:planId', doAuth, getMyReviewForPlanController);

router.post('/', doAuth, createReviewController);

router.put('/', doAuth, updateReviewController);

router.delete('/:planId', doAuth, deleteReviewController);





export default router;export async function getReviewsOfPlanController(req: Request, res: Response) {
  const planId = Number(req.params.planId);

  if (!planId) {
    throw new AppError('Invalid Plan Id', 404);
  }

  const reviews = await getReviewsOfPlan(planId);

  res.json(reviews);

}

