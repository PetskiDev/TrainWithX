import {
  getAuthUser,
  getUser,
  getUserPlans,
  getUsers,
  promoteToCreator,
} from '@backend/features/users/user.controller';
import { doAuth } from '@backend/middleware/auth';
import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.get('/me', doAuth, getAuthUser);

router.get('/:id', getUser);

router.patch('/:id/promote-creator', promoteToCreator); //TODO
router.get('/:id/plans', getUserPlans); //PLANS THAT AN USER OWNS

export default router;
