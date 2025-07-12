import { Router } from 'express';
import {
  createPlanController,
  getAllPlans,
  subdomainSlugController,
} from './plan.controller';
import { doAuth } from '@src/middleware/auth';

const router = Router();

router.get('/', getAllPlans);

router.post('/', doAuth, createPlanController);

router.get('/:subdomain/:slug', subdomainSlugController);


export default router;
