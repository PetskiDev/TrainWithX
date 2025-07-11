import {
  getUser,
  getUserPlans as getOwnedPlans,
  getUsers,
  promoteToCreator,
} from '@src/features/users/user.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getUsers);

router.get('/:id', getUser);

router.patch('/:id/promote-creator', promoteToCreator); //TODO

export default router;
