import {
  getAllCreators,
  getByUsername as getBySub,
} from '@src/features/creators/creator.controller';
import { getCreatorPlans } from '@src/features/plans/plan.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllCreators);
router.get('/:subdomain', getBySub);
//router.post('/', ); //THIS SHOULD BE TOTALLY NEW CREATOR, old upgrade moved to /users/:id/promote-creator
router.get('/:subdomain/plans', getCreatorPlans);

//router.get('/:username/plans/:slug', getPlansOfCreatorWithSlug);

export default router;
