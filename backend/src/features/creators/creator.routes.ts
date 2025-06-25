import {
  getAllCreators,
} from '@backend/features/creators/creator.controller';
import {
  getCreatorPlans,
  getPlansOfCreatorWithSlug,
} from '@backend/features/plans/plan.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllCreators);
//router.post('/', ); //THIS SHOULD BE TOTALLY NEW CREATOR, old upgrade moved to /users/:id/promote-creator
router.get('/:username/plans', getCreatorPlans);
router.get('/:username/plans/:slug', getPlansOfCreatorWithSlug);

export default router;
