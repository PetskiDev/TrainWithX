import { Router } from 'express';
import { doAuth } from '@src/middleware/auth';
import { createCompletionController } from '@src/features/completions/compoetions.controller';

const router = Router();

router.post('/', doAuth, createCompletionController);

export default router;
