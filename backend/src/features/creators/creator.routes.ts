import {
  getAllCreators,
  getById,
  getBySubdomain as getBySub,
  postCreatorApplication,
} from '@src/features/creators/creator.controller';
import { getCreatorPlans } from '@src/features/plans/plan.controller';
import { doAuth } from '@src/middleware/auth';
import { Router } from 'express';

const router = Router();

router.get('/', getAllCreators);
router.post('/apply', doAuth, postCreatorApplication);
router.get('/:id', getById);
router.get('/sub/:subdomain', getBySub);
//router.post('/', ); //THIS SHOULD BE TOTALLY NEW CREATOR, old upgrade moved to /users/:id/promote-creator
router.get('/sub/:subdomain/plans', getCreatorPlans);

//router.get('/:username/plans/:slug', getPlansOfCreatorWithSlug);

export default router;
