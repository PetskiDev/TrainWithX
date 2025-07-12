import { Router } from 'express';
import {
  createPlanController,
  getAllPlans,
  getPlanSubSlugContent,
  getPlanSubSlugPreveiw,
} from './plan.controller';
import { doAuth } from '@src/middleware/auth';

const router = Router();

router.get('/', getAllPlans);

router.post('/', doAuth, createPlanController);

router.get('/preview/:subdomain/:slug', getPlanSubSlugPreveiw);

//do some security here.
router.get('/content/:subdomain/:slug', getPlanSubSlugContent);

export default router;
