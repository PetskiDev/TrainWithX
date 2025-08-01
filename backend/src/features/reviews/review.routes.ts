import { Router } from 'express';

import { doAuth } from '@src/middleware/auth.js';
import { createReviewController as createMyReviewController, updateReviewController as updateMyReviewController } from '@src/features/reviews/review.controller.js';

const router = Router();

router.post('/', doAuth, createMyReviewController);

router.put('/', doAuth, updateMyReviewController);

export default router;
