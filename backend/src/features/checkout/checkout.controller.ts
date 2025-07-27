import {
  checkUserPurchasedPlan,
  generateTransactionToken,
  handlePaymentComplete as createPurchase,
} from '@src/features/checkout/checkout.service.js';
import { AppError } from '@src/utils/AppError.js';
import { Request, Response } from 'express';
import { env } from '@src/utils/env.js';
import {
  EventEntity,
  EventName,
  TransactionNotification,
} from '@paddle/paddle-node-sdk';
import { paddle } from '@src/utils/paddle.js';

export async function startPurchaseController(req: Request, res: Response) {
  const { planId } = req.body;
  const userId = req.user!.id;

  if (!planId) {
    throw new AppError('PlanId is required', 400);
  }

  const purchased = await checkUserPurchasedPlan({ userId, planId }); //throws if already purchased
  
  if (purchased) {
    throw new AppError('Plan Already Purchased', 400);
  }

  const token = await generateTransactionToken({ planId, userId }); //Generates link

  res.json({ token }); // front-end will redirect/open this
}


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
    throw new AppError('[PADDLE] Invalid Signature', 400);
  }

  switch (eventData.eventType) {
    case EventName.TransactionPaid:
      const data = eventData.data as TransactionNotification;
      const customData = data.customData as TransactionCustomData;
      console.log(
        '[PADDLE] Transaction paid: ',
        `id:${data.id} Info:${customData}`
      );
      //PAYMENT COMPLETED.
      await createPurchase({
        userId: customData.userId,
        planId: customData.planId,
        amount: Number(data.details?.totals?.total) / 100.0,
        transactionId: data.id,
      });
      break;
    default:
      console.log('[PADDLE] Unhandled Paddle event: ', eventData.eventType);
  }

  res.status(200).json({ success: true });
}
