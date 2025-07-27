import { prisma } from '@src/utils/prisma.js';
import { AppError } from '@src/utils/AppError.js';
import { generateTransaction } from '@src/utils/paddle.js';

export async function generateTransactionToken({
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

export async function handlePaymentComplete({
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

export async function checkUserPurchasedPlan({
  planId,
  userId,
}: {
  planId: number;
  userId: number;
}) {
  const purchase = await prisma.purchase.findUnique({
    where: { userId_planId: { userId, planId } },
  });
  return !!purchase;
}

export async function enforceHasPurchased({
  userId, planId,
}: {
  userId: number;
  planId: number;
}) {
  const hasPurchased = await prisma.purchase.findUnique({
    where: {
      userId_planId: {
        userId,
        planId,
      },
    },
  });
  if (!hasPurchased) {
    throw new AppError("Unauthorized. You don't own the plan", 401);
  }
}
