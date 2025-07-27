import 'express-async-errors';

import express from 'express';
import { Request, Response } from 'express';
import { errorHandler } from '@src/middleware/errorHandler.js';
import morgan from 'morgan';
import apiRouter from './api.router.js';
import path, { dirname } from 'node:path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cookieParser());

app.use(morgan('dev'));

app.use('/api/v1', apiRouter);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

//this part only runs when vite does not run
//in dev vite handles this responses and only proxies /api calls
if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(dist)); //mounts the static files
  app.get('*', (_, res) => res.sendFile(path.join(dist, 'index.html'))); //mounts indexjs that is the whole react
} else {
  app.get('/', (req: Request, res: Response) => {
    res.send('DEV ENV - ONLY API');
  });
}

app.use(errorHandler);

export default app;
