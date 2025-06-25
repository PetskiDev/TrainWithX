import { Router } from 'express';
import {
  getAllPlans,
  getPlanWithSlug,
  createPlanAsAdmin,
} from './plan.controller';

const router = Router();

router.get('/', getAllPlans);
router.get('/:slug', getPlanWithSlug);


router.post('/admin/createplan', createPlanAsAdmin);


export default router;
