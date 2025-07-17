import {
  adminDashboardController,
  getAllPlansAdminController,
  getAllUsersAdminController,
  getCreatorApplicationsController,
} from '@src/features/admin/admin.controller';
import { getAllCreatorsAdminController } from './admin.controller';
import { doAuth, isAdmin } from '@src/middleware/auth';
import { Router } from 'express';

const router = Router();
router.use(doAuth, isAdmin);

router.get('/stats', adminDashboardController);

router.get('/plans', getAllPlansAdminController);
router.get('/creators', getAllCreatorsAdminController);

router.get('/users', getAllUsersAdminController);

router.get('/creator-applications', getCreatorApplicationsController);

export default router;
