import { getUserByIdAdminController } from '../admin/admin.controller';
import { promoteToCreatorController } from '../creators/creator.controller';
import { getAllUsersAdminController } from '../admin/admin.controller';
import { Router } from 'express';

const router = Router();

router.get('/:id', getUserByIdAdminController);

router.patch('/:id/promote-creator', promoteToCreatorController); //TODO

export default router;
