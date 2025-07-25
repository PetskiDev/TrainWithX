import { addCreatorApplicationController, getCreatorApplicationController } from '@src/features/creatorApplication/creatorApplication.controller';
import { doAuth } from '@src/middleware/auth';
import { Router } from 'express';

const router = Router();

router.post('/', doAuth, addCreatorApplicationController);

router.get('/me', doAuth, getCreatorApplicationController);

export default router;