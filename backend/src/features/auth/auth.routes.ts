import {
  loginController,
  logoutController,
  registerController,
} from '@src/features/auth/auth.controller';
import { Router } from 'express';

const router = Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/logout', logoutController);

export default router;
