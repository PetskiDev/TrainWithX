import {
  googleCallbackController,
  redirectToGoogle,
  loginController,
  logoutController,
  registerController,
  verifyController,
} from '@src/features/auth/auth.controller';
import { Router } from 'express';

const router = Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/logout', logoutController);
router.post('/verify-email', verifyController);

router.get('/google', redirectToGoogle);
router.get('/google/callback', googleCallbackController);

export default router;
