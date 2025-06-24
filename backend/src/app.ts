import 'express-async-errors';

import express from 'express';
import { Request, Response } from 'express';
import userRouter from './features/users/user.routes';
import authRouter from './features/auth/auth.routes';
import { errorHandler } from '@backend/middleware/errorHandler';
import { eventNames } from 'process';

const app = express();
app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TrainWithX');
});


console.log(errorHandler);
app.use(errorHandler);

export default app;
