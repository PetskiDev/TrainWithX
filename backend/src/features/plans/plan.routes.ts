import { Router } from 'express';
import {
  getAllPlans,
  subdomainSlugController,
} from './plan.controller';

const router = Router();

router.get('/', getAllPlans);

router.get('/:subdomain/:slug', subdomainSlugController);


export default router;
