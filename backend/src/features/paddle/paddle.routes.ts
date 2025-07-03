import { Router } from 'express';
import {
  planCheckoutController,
} from './paddle.controller';
import express from 'express';
import { doAuth } from '@src/middleware/auth';

const router = Router();

router.post('/checkout', doAuth, planCheckoutController);

// Webhook initialized in app for json things. 

export default router;
