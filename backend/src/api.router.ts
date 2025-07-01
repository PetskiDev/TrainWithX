import userRouter from './features/users/user.routes';
import authRouter from './features/auth/auth.routes';
import creatorRouter from './features/creators/creator.routes';
import planRouter from './features/plans/plan.routes';
import paddleRouter from './features/paddle/paddle.routes';
import { Router } from 'express';
import { nukeDB } from '@src/utils/nukeDB';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/creators', creatorRouter);
router.use('/plans', planRouter);
router.use('/paddle', paddleRouter);
router.delete('/', nukeDB);

export default router;
