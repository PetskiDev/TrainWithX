import {
  googleCallbackController,
  redirectToGoogleController,
  loginController,
  logoutController,
  registerController,
  verifyController,
} from '@src/features/auth/auth.controller.js';
import { doAuth } from '@src/middleware/auth.js';
import { Router } from 'express';

const router = Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/logout', doAuth, logoutController);
router.post('/email-verification', verifyController);

router.get('/google', redirectToGoogleController);
router.get('/google/callback', googleCallbackController);

export default router;
