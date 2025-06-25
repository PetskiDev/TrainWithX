import 'express-async-errors';

import express from 'express';
import { Request, Response } from 'express';
import userRouter from './features/users/user.routes';
import authRouter from './features/auth/auth.routes';
import creatorRouter from './features/creators/creator.routes';
import planRouter from './features/plans/plan.routes';
import { errorHandler } from '@backend/middleware/errorHandler';
import { eventNames } from 'process';
import { nukeDB } from '@backend/utils/nukeDB';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(
  cors({
    origin: '*', // change with the url in prod *****
    credentials: true, // if you're sending cookies/auth headers
  })
);

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/creators', creatorRouter);
app.use('/api/v1/plans', planRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TrainWithX');
});

app.delete('/api/v1/', nukeDB);

app.use(errorHandler);

export default app;
