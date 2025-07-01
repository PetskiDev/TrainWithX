import { Router } from 'express';
import { planCheckoutController } from './paddle.controller';
import express from 'express';
import { doAuth } from '@src/middleware/auth';

const router = Router();

router.post('/checkout', doAuth, planCheckoutController);

//router.post('/webhook', paddleWebhookController);

export default router;
