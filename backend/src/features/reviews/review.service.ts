import { Prisma } from '@prisma/client';
import { CreateReviewDTO, ReviewPreviewDTO, UpdateReviewDTO } from '@shared/types/review';
import { AppError } from '@src/utils/AppError';
import { prisma } from '@src/utils/prisma';

export async function enforceHasPurchased({
  userId,
  planId,
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
async function getCreatorIdForPlan(
  planId: number,
  tx: Prisma.TransactionClient
) {
  const plan = await tx.plan.findUnique({
    where: { id: planId },
    select: { creatorId: true },
  });

  if (!plan) throw new AppError('Plan not found', 404);
  return plan.creatorId;
}

// Update stats for creators and plans
// Storing info in the plan and creator themselves so the things are not calculated
async function recalculateReviewStats(
  creatorId: number,
  planId: number,
  tx: Prisma.TransactionClient
) {
  // Plan-level stats
  const { _avg: planAvg, _count: planCount } = await tx.review.aggregate({
    where: { planId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await tx.plan.update({
    where: { id: planId },
    data: {
      avgRating: new Prisma.Decimal((planAvg.rating ?? 0).toFixed(2)),
      noReviews: planCount.rating,
    },
  });

  // Creator-level stats
  const { _avg: creatorAvg, _count: creatorCount } = await tx.review.aggregate({
    where: { plan: { creatorId } },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await tx.creator.update({
    where: { id: creatorId },
    data: {
      avgRating: new Prisma.Decimal((creatorAvg.rating ?? 0).toFixed(1)),
      noReviews: creatorCount.rating,
    },
  });
}

export async function getReview(userId: number, planId: number): Promise<ReviewPreviewDTO> {
  const review = await prisma.review.findUnique({
    where: {
      userId_planId: {
        userId,
        planId,
      },
    },
    select: {
      rating: true,
      comment: true,
      createdAt: true,
    },
  });

  if (!review) {
    throw new AppError('User has no review!', 404);
  }

  return {
    rating: review.rating,
    comment: review.comment ?? '',
    createdAt: review.createdAt,
    planId,
    userId,
  };
}



export async function createReview(userId: number, dto: CreateReviewDTO) {
  await enforceHasPurchased({ userId, planId: dto.planId }); // do not let user reveiew not owned plan

  await prisma.$transaction(async (tx) => {
    // Check if review already exists
    const existing = await tx.review.findUnique({
      where: {
        userId_planId: {
          userId: userId,
          planId: dto.planId,
        },
      },
    });

    if (existing) {
      throw new AppError('You already reviewed this plan', 400);
    }

    // Create the review
    await tx.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        userId: userId,
        planId: dto.planId,
      },
    });

    const creatorId = await getCreatorIdForPlan(dto.planId, tx);

    // Update stats for creators and plans
    await recalculateReviewStats(creatorId, dto.planId, tx);
  });
}

export async function updateReview(userId: number, dto: UpdateReviewDTO) {
  await prisma.$transaction(async (tx) => {
    const review = await tx.review.findUnique({
      where: {
        userId_planId: {
          userId,
          planId: dto.planId,
        },
      },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    await tx.review.update({
      where: {
        userId_planId: {
          userId,
          planId: dto.planId,
        },
      },
      data: {
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    const creatorId = await getCreatorIdForPlan(dto.planId, tx);

    await recalculateReviewStats(creatorId, dto.planId, tx);
  });
}

export async function deleteReview(userId: number, planId: number) {
  await prisma.$transaction(async (tx) => {
    const review = await tx.review.findUnique({
      where: {
        userId_planId: {
          userId,
          planId,
        },
      },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    await tx.review.delete({
      where: {
        userId_planId: {
          userId,
          planId,
        },
      },
    });

    const creatorId = await getCreatorIdForPlan(planId, tx);

    await recalculateReviewStats(creatorId, planId, tx);
  });
}
