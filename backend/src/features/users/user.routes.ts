import {
  getUser,
  getUserPlans,
  getUsers,
  promoteToCreator,
} from '@backend/features/users/user.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/:id/promote-creator', promoteToCreator); //TODO
router.get('/:id/plans', getUserPlans); //TODO

export default router;
