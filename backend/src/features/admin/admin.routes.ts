import {
  adminDashboardController,
  getCreatorApplications,
} from '@src/features/admin/admin.controller';
import { doAuth, isAdmin } from '@src/middleware/auth';
import { Router } from 'express';

const router = Router();

router.get('/stats', doAuth, isAdmin, adminDashboardController);
router.get('/creator-applications', doAuth, isAdmin, getCreatorApplications);

export default router;
