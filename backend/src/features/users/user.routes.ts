import {
  getAuthUser,
  getUser,
  getUserPlans as getOwnedPlans,
  getUsers,
  promoteToCreator,
} from '@src/features/users/user.controller';
import { doAuth } from '@src/middleware/auth';
import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.get('/me', doAuth, getAuthUser);
router.get('/me/plans', doAuth, getOwnedPlans); //PLANS THAT AN USER OWNS

router.get('/:id', getUser);

router.patch('/:id/promote-creator', promoteToCreator); //TODO

export default router;
