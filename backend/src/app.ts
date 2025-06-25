import 'express-async-errors';

import express from 'express';
import { Request, Response } from 'express';
import userRouter from './features/users/user.routes';
import authRouter from './features/auth/auth.routes';
import creatorRouter from './features/creators/creator.routes';
import { errorHandler } from '@backend/middleware/errorHandler';
import { eventNames } from 'process';
import { nukeDB } from '@backend/utils/nukeDB';

const app = express();
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/creators', creatorRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TrainWithX');
});

app.delete('/api/v1/', nukeDB);

console.log(errorHandler);
app.use(errorHandler);

export default app;
