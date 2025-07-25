import { Request, Response } from 'express';
import { AppError } from '@src/utils/AppError';
import { sendContactMessage } from './contact.service';

export async function contactController(req: Request, res: Response) {
  const { email, reason, customReason, message } = req.body;

  if (!email || !message || (!reason && !customReason)) {
    throw new AppError('Email, message, and reason are required.', 400);
  }

  await sendContactMessage({ email, reason, customReason, message });

  res.status(200).json({ message: 'Message received. We’ll get back to you within 24h.' });
}
