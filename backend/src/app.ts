import 'express-async-errors';

import express from 'express';
import { Request, Response } from 'express';
import { errorHandler } from '@src/middleware/errorHandler';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './api.router';
import path from 'path';

const app = express();

//just for dev (even not needed)
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use('/api/v1', apiRouter);

app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.get('/', (req: Request, res: Response) => {
    res.send('PROD BROKEN, FIXING PATHS');
  });

  const dist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(dist));
  app.get('*', (_, res) => res.sendFile(path.join(dist, 'index.html')));
} else {
  app.get('/', (req: Request, res: Response) => {
    res.send('DEV ONLY API WORKS');
  });
}

app.use(errorHandler);

export default app;
