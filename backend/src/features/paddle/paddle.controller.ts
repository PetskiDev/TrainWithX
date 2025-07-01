import {
  checkoutService,
} from '@src/features/paddle/paddle.service';
import { AppError } from '@src/utils/AppError';
import { Request, Response } from 'express';
import { env } from '@src/utils/env';
import { WebhooksValidator } from '@paddle/paddle-node-sdk';
import { webhooksValidator } from '@src/utils/paddle';

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

// export async function paddleWebhookController(req: Request, res: Response) {
//   const signatureHeader = req.headers['paddle-signature'] as string;

//   const valid = await webhooksValidator.isValidSignature(
//     req.body,
//     env.PADDLE_WEBHOOK_KEY,
//     signatureHeader
//   );

//   if (!valid) {
//     throw new AppError('Invalid Signature', 401);
//   }
//   const event = req.body.event;
//   const { userId, planId } = event.custom_data;

//   switch (event.eventType) {
//     case 'transaction.paid':
//       console.log('Transaction paid:', event.data);
//       await paymentComplete(userId, planId, event);

//       break;
//     case 'subscription.updated':
//       console.log('Subscription updated:', event.data);
//       break;
//     default:
//       console.log('Unhandled Paddle event:', event.eventType);
//   }

//   res.status(200).json({ success: true });
// }
