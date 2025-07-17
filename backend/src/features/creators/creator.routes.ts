import {
  getAllCreatorsPreviewController,
  getCreatorPreveiwByIdController,
  getCreatorBySubController,
  editMyCreatorController,
  getMyCreatorController,
} from '@src/features/creators/creator.controller';
import { getReviewsOfCreatorController } from '../reviews/review.controller';
import { getPlansFromCreatorSubController, getMyCreatedPlansController } from '@src/features/plans/plan.controller';
import { doAuth } from '@src/middleware/auth';
import { Router } from 'express';

const router = Router();

router.get('/', getAllCreatorsPreviewController);

router.get('/me', doAuth, getMyCreatorController);

router.patch('/me', doAuth, editMyCreatorController);

router.get('/me/plans', doAuth, getMyCreatedPlansController); 

router.get('/by-subdomain/:subdomain', getCreatorBySubController);

router.get('/by-subdomain/:subdomain/plans', getPlansFromCreatorSubController);

router.get('/:creatorId/reviews', getReviewsOfCreatorController);

router.get('/:id', getCreatorPreveiwByIdController);

export default router;
