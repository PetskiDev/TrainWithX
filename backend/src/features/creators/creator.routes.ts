import {
  getAllCreatorsPreviewController,
  getCreatorPreveiwByIdController,
  getCreatorBySubController,
  editMyCreatorController,
  getMyCreatorController,
  uploadCreatorCoverController,
} from '@src/features/creators/creator.controller.js';
import { getReviewsOfCreatorController } from '../reviews/review.controller.js';
import { getPlansFromCreatorSubController, getMyCreatedPlansController } from '@src/features/plans/plan.controller.js';
import { doAuth } from '@src/middleware/auth.js';
import { Router } from 'express';
import { multerImageUpload } from '@src/middleware/multer.uploads.js';

const router = Router();

router.get('/', getAllCreatorsPreviewController);

router.get('/me', doAuth, getMyCreatorController);

router.patch('/me', doAuth, editMyCreatorController);

router.patch(
  '/me/cover', // must be logged in
  doAuth,
  multerImageUpload("cover"), // Multer middleware
  uploadCreatorCoverController
);

router.get('/me/plans', doAuth, getMyCreatedPlansController);

router.get('/by-subdomain/:subdomain', getCreatorBySubController);

router.get('/by-subdomain/:subdomain/plans', getPlansFromCreatorSubController);

router.get('/:creatorId/reviews', getReviewsOfCreatorController);

router.get('/:id', getCreatorPreveiwByIdController);

export default router;
