import { adminDashboardController } from '@src/features/admin/admin.controller';
import { doAuth, isAdmin } from '@src/middleware/auth';
import { Router } from 'express';

const router = Router();

router.get('/stats', doAuth, isAdmin, adminDashboardController);

export default router;
