import { addCreatorApplicationController } from '@src/features/creatorApplication/creatorApplication.controller';
import { doAuth } from '@src/middleware/auth';
import { Router } from 'express';

const router = Router();

router.post('/', doAuth, addCreatorApplicationController);

export default router;