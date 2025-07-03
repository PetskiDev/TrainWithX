import {
  checkoutService,
  paymentComplete,
} from '@src/features/paddle/paddle.service';
import { AppError } from '@src/utils/AppError';
import { Request, Response } from 'express';
import { env } from '@src/utils/env';
import {
  EventEntity,
  EventName,
  TransactionNotification,
  WebhooksValidator,
} from '@paddle/paddle-node-sdk';
import { paddle } from '@src/utils/paddle';

const verifier = new WebhooksValidator();

export async function planCheckoutController(req: Request, res: Response) {
  const { planId } = req.body;
  const userId = req.user!.id;

  if (!planId) {
    throw new AppError('PlanId is required', 400);
  }

  const token = await checkoutService(planId, userId);

  res.json({ token }); // front-end will redirect/open this
}

// raw body

interface TransactionCustomData {
  userId: number;
  planId: number;
}
export async function paddleWebhookController(req: Request, res: Response) {
  const signature = (req.headers['paddle-signature'] as string) || '';
  const rawRequestBody: string = req.body.toString();
  const secretKey = env.PADDLE_WEBHOOK_KEY;
  let eventData: EventEntity;
  try {
    eventData = await paddle.webhooks.unmarshal(
      rawRequestBody,
      secretKey,
      signature
    );
  } catch (e) {
    throw new AppError('Invalid Signature', 400);
  }

  switch (eventData.eventType) {
    case EventName.TransactionPaid:
      const data = eventData.data as TransactionNotification;
      const customData = data.customData as TransactionCustomData;
      console.log('Transaction paid: ', `id:${data.id} Info:${customData}`);
      await paymentComplete({
        userId: customData.userId,
        planId: customData.planId,
        amount: Number(data.details?.totals?.total) / 100.0,
        transactionId: data.id,
      });
      break;
    default:
      console.log('Unhandled Paddle event: ', eventData.eventType);
  }

  res.status(200).json({ success: true });
}
