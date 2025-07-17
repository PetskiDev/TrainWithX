import { promoteToCreatorController } from '../creators/creator.controller';
import { Router } from 'express';
import { getMyUserController } from '@src/features/users/user.controller';
import { doAuth } from '@src/middleware/auth';

const router = Router();

router.get('/me', doAuth, getMyUserController);

router.patch('/:id/promote-creator', promoteToCreatorController); //TODO

export default router;
