import express from 'express';
import { Request, Response } from 'express';
import userRouter from './features/users/user.routes';

const app = express();
app.use(express.json());

app.use('/api/v1/users', userRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TrainWithX');
});

export default app;
