import { Router } from 'express';
import {
  createPlanController,
  deletePlanController,
  getAllPlansPreview,
  getPlanSubSlugContent,
  getPlanSubSlugPreveiw,
} from './plan.controller';
import { getReviewsOfPlanController } from '../reviews/review.routes';
import { doAuth } from '@src/middleware/auth';

const router = Router();

router.get('/', getAllPlansPreview);
router.delete('/:planId', deletePlanController);

router.post('/', doAuth, createPlanController);
router.get('/preview/:subdomain/:slug', getPlanSubSlugPreveiw);

//do some security here.
router.get('/content/:subdomain/:slug', getPlanSubSlugContent);

router.get('/:planId/reviews', getReviewsOfPlanController);

export default router;
