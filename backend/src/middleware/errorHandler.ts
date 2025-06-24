import { AppError } from '@backend/utils/AppError';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.log('HAHHA');
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error('[UNHANDLED ERROR]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
