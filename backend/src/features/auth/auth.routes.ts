import {
  loginController,
  registerController,
} from '@src/features/auth/auth.controller';
import { Router } from 'express';

const router = Router();

router.post('/login', loginController);
router.post('/register', registerController);

export default router;
