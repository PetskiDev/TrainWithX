import userRouter from './features/users/user.routes';
import authRouter from './features/auth/auth.routes';
import creatorRouter from './features/creators/creator.routes';
import planRouter from './features/plans/plan.routes';
import purchasesRouter from './features/purchases/purchases.routes';
import adminRouter from '@src/features/admin/admin.routes';
import reviewRouter from '@src/features/reviews/review.routes';
import creatorApplicationRouter from '@src/features/creatorApplication/creatorApplication.routes';

import { Router } from 'express';
import { nukeDB } from '@src/utils/nukeDB';
import express from 'express';
import { paddleWebhookController } from '@src/features/purchases/purchases.controller';
const router = Router();
router.post(
  '/webhooks/paddle',
  express.raw({ type: '*/*' }),
  paddleWebhookController
);
router.use(express.json());
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/users', userRouter);
router.use('/creators', creatorRouter);
router.use('/creator-application', creatorApplicationRouter);
router.use('/plans', planRouter);
router.use('/purchases', purchasesRouter);
router.use('/reviews', reviewRouter);
router.delete('/', nukeDB);

export default router;
