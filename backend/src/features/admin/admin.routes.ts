import {
  adminDashboardController,
  getAllPlansAdminController,
  getAllUsersAdminController,
  getCreatorApplicationsController,
} from '@src/features/admin/admin.controller.js';
import { getAllCreatorsAdminController } from './admin.controller.js';
import { doAuth, isAdmin } from '@src/middleware/auth.js';
import { Router } from 'express';
import { approveCreatorApplicationController, rejectApplicationController } from '@src/features/creatorApplication/creatorApplication.controller.js';

const router = Router();
router.use(doAuth, isAdmin);

router.get('/stats', adminDashboardController);

router.get('/plans', getAllPlansAdminController);
router.get('/creators', getAllCreatorsAdminController);

router.get('/users', getAllUsersAdminController);

router.get('/creator-applications', getCreatorApplicationsController);

router.patch('/creator-applications/:id/approve', approveCreatorApplicationController);

router.patch('/creator-applications/:id/reject', rejectApplicationController);


//router.patch('users/:id/promote', promoteToCreatorController); //TODO


export default router;
