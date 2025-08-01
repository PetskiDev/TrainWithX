import { Router } from 'express';
import {
  createPlanController,
  deletePlanController,
  editPlanController,
  getAllPlansPreview,
  getPlanContentByIdController,
  getPlanSubSlugContent,
  getPlanSubSlugPreveiw,
  uploadPlanImageController,
} from './plan.controller.js';
import { deleteReviewController, getMyReviewForPlanController, getReviewsOfPlanController } from '../reviews/review.controller.js';
import { doAuth } from '@src/middleware/auth.js';
import { multerImageUpload } from '@src/middleware/multer.uploads.js';

const router = Router();

router.get('/', getAllPlansPreview);

router.post('/', doAuth, createPlanController);

router.get('/:planId/content', doAuth, getPlanContentByIdController);

router.put('/:planId', doAuth, editPlanController);

router.patch(
  '/:planId/image', 
  doAuth,
  multerImageUpload("image"),
  uploadPlanImageController);

//TODO: CHECK IF THE USER IS THE CREATOR OF THE PLAN
//TODO: Make an admin controller in .admin without that validation
router.delete('/:planId', doAuth, deletePlanController);

router.get('/preview/:subdomain/:slug', getPlanSubSlugPreveiw);

//TODO: check if user HAS PURCHASED plan.
router.get('/:subdomain/:slug/content', doAuth, getPlanSubSlugContent);

router.get('/:planId/reviews', getReviewsOfPlanController);

router.get('/:planId/reviews/me', doAuth, getMyReviewForPlanController);

router.delete('/:planId/reviews/me', doAuth, deleteReviewController);


export default router;
