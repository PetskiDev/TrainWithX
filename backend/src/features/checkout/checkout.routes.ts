//TODO: Rename this to purchases

import { Router } from 'express';
import {
  startPurchaseController,
} from './checkout.controller';
import { doAuth } from '@src/middleware/auth';

const router = Router();

router.post('/', doAuth, startPurchaseController);

// Webhook initialized in app for json things. TODO:MOVE IT HERE BECASUE IT WON't HAVE /PADDLE PREFIX

export default router;
