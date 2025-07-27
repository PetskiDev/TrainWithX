import { addCreatorApplicationController, getCreatorApplicationController } from '@src/features/creatorApplication/creatorApplication.controller.js';
import { doAuth } from '@src/middleware/auth.js';
import { Router } from 'express';

const router = Router();

router.post('/', doAuth, addCreatorApplicationController);

router.get('/me', doAuth, getCreatorApplicationController);

export default router;