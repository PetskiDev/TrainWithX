import { prisma } from '@src/utils/prisma';
import { AppError } from '@src/utils/AppError';
import { generateTransaction } from '@src/utils/paddle';

export async function checkoutService(planId: number, userId: number) {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) {
    throw new AppError('Plan not found', 404);
  }
  const payLink = await generateTransaction({
    priceId: plan.paddlePriceId,
    userId,
  });
  return payLink;
}

// export async function paymentComplete(
//   planId: number,
//   userId: number,
//   event: any
// ) {
//   await prisma.purchase.create({
//     data: {
//       userId,
//       planId,
//       paddleOrderId: event.data.order_id,
//       amount: event.data.amount,
//     },
//   });
// }
