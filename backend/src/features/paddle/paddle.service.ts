import { prisma } from '@src/utils/prisma';
import { AppError } from '@src/utils/AppError';
import { generateTransaction } from '@src/utils/paddle';

export async function checkoutService({
  planId,
  userId,
}: {
  planId: number;
  userId: number;
}) {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) {
    throw new AppError('Plan not found', 404);
  }
  const payLink = await generateTransaction({
    plan,
    quantity: 1,
    userId,
  });
  return payLink;
}

export async function paymentComplete({
  userId,
  planId,
  amount,
  transactionId,
}: {
  userId: number;
  planId: number;
  amount: number;
  transactionId: string;
}) {
  await prisma.purchase.create({
    data: {
      userId,
      planId,
      amount,
      paddleOrderId: transactionId,
    },
  });
}

export async function checkAlreadyPurchased({
  planId,
  userId,
}: {
  planId: number;
  userId: number;
}) {
  const purchase = await prisma.purchase.findUnique({
    where: { userId_planId: { userId, planId } },
  });
  if (purchase) {
    throw new AppError('Plan Already Purchased', 400);
  }
}
