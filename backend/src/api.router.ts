import userRouter from './features/users/user.routes';
import authRouter from './features/auth/auth.routes';
import creatorRouter from './features/creators/creator.routes';
import planRouter from './features/plans/plan.routes';
import paddleRouter from './features/paddle/paddle.routes';
import meRouter from '@src/features/me/me.routes';
import adminRouter from '@src/features/admin/admin.routes';

import { Router } from 'express';
import { nukeDB } from '@src/utils/nukeDB';
import express from 'express';
import { paddleWebhookController } from '@src/features/paddle/paddle.controller';
const router = Router();
router.post(
  '/paddle/webhook',
  express.raw({ type: '*/*' }),
  paddleWebhookController
);
router.use(express.json());
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/users', userRouter);
router.use('/me', meRouter);
router.use('/creators', creatorRouter);
router.use('/plans', planRouter);
router.use('/paddle', paddleRouter);
router.delete('/', nukeDB);

export default router;
