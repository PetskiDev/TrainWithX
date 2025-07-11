import { Router } from 'express';
import {
  getAllPlans,
  createPlanAsAdmin,
  subdomainSlugController,
} from './plan.controller';

const router = Router();

router.get('/', getAllPlans);

router.get('/:subdomain/:slug', subdomainSlugController);

router.post('/admin/createplan', createPlanAsAdmin);

export default router;
