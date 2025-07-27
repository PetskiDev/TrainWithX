import { Router } from 'express';
import { doAuth } from '@src/middleware/auth.js';
import { createCompletionController } from '@src/features/completions/compoetions.controller.js';

const router = Router();

router.post('/', doAuth, createCompletionController);

export default router;
