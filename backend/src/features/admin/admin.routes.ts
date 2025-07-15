import {
  adminDashboardController,
  getCreatorApplications,
} from '@src/features/admin/admin.controller';
import { getAllCreatorsFullDTO } from '@src/features/creators/creator.controller';
import { getAllPlansCreatorDTO } from '@src/features/plans/plan.controller';
import { doAuth, isAdmin } from '@src/middleware/auth';
import { Router } from 'express';

const router = Router();
router.use(doAuth, isAdmin);

router.get('/stats',adminDashboardController);

router.get('/plans', getAllPlansCreatorDTO);
router.get('/creators', getAllCreatorsFullDTO);

router.get('/creator-applications', doAuth, isAdmin, getCreatorApplications);

export default router;
