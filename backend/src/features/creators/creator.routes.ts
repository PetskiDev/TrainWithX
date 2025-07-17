import {
  getAllCreatorsPreviewController,
  getCreatorByIdController,
  getCreatorBySubController,
  editCreatorController,
} from '@src/features/creators/creator.controller';
import { getReviewsOfCreatorController } from '../reviews/review.controller';
import { postCreatorApplicationController } from '../creatorApplication/creatorApplication.controller';
import { getCreatorPlansController } from '@src/features/plans/plan.controller';
import { doAuth } from '@src/middleware/auth';
import { Router } from 'express';

const router = Router();

router.get('/', getAllCreatorsPreviewController);
router.post('/apply', doAuth, postCreatorApplicationController);
router.get('/:id', getCreatorByIdController);
router.patch('/:creatorId', doAuth, editCreatorController);
router.get('/sub/:subdomain', getCreatorBySubController);
//router.post('/', ); //THIS SHOULD BE TOTALLY NEW CREATOR, old upgrade moved to /users/:id/promote-creator
router.get('/sub/:subdomain/plans', getCreatorPlansController);

router.get('/:creatorId/reviews', getReviewsOfCreatorController);

//router.get('/:username/plans/:slug', getPlansOfCreatorWithSlug);

export default router;
