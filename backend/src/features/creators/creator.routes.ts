import {
  upgradeToCreator,
  getAllCreators,
} from '@backend/features/creators/creator.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllCreators);
router.post('/', upgradeToCreator);
// router.get('/:username/plans', getCreatorPlans);
// router.get('/:username/plans/:slug', getCreatorPlanBySlug);

export default router;
