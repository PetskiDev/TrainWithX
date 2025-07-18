// backend/src/features/plans/plan.service.ts
import { prisma } from '@src/utils/prisma';
import { AppError } from '@src/utils/AppError';
import { CreatePlanDto, PlanContentJSON, PlanWithRevenue, PlanPreview } from '@shared/types/plan';
import { createDiscountFor, createProductWithPrice } from '@src/utils/paddle';
import { toPlanCreatorData, toPlanPreview } from '@src/features/plans/plan.transformer';
import { Prisma } from '@prisma/client';

export async function getAllPlans() {
  return prisma.plan.findMany({
    include: { purchases: true, creator: { include: { user: true } } },
    orderBy: { id: 'desc' },
  });
}

export async function deletePlanWithId(planId: number) {
  await prisma.plan.delete({ where: { id: planId } });
}

export async function fetchCreatorPlans(subdomain: string) {
  const creator = await prisma.creator.findFirst({
    where: { subdomain },
    include: {
      plans: {
        include: {
          creator: {
            include: { user: true },
          },
          purchases: true,
        },
      },
    },
  });

  if (!creator) throw new AppError('Creator not found', 404);
  return creator.plans;
}

export async function fetchPlanBySlug(slug: string) {
  const plan = await prisma.plan.findFirst({
    where: {
      slug,
    },
    include: { creator: { include: { user: true } } },
  });

  if (!plan) throw new AppError('Plan not found', 404);
  return plan;
}

export async function createPlanService(newPlan: CreatePlanDto) {
  const { product, price } = await createProductWithPrice({
    name: newPlan.title,
    description: newPlan.description,
    inputPrice: newPlan.originalPrice ? newPlan.originalPrice : newPlan.price,
  });

  let discountId = await createDiscountFor(newPlan);

  const { slug, goals, tags, weeks, introVideo, ...previewData } = newPlan;
  const totalWorkouts = weeks.reduce(
    (acc, week) => acc + week.days.filter((d) => d.type === 'workout').length,
    0
  );

  const totalWeeks = weeks.length;
  const newContent: PlanContentJSON = {
    goals,
    tags,
    weeks,
    introVideo,
    totalWeeks,
  };

  try {
    return await prisma.plan.create({
      data: {
        slug: slug.toLowerCase(),
        ...previewData,
        paddleProductId: product.id,
        paddlePriceId: price.id,
        paddleDiscountId: discountId,
        content: JSON.parse(JSON.stringify(newContent)),
      },
      include: {
        purchases: true,
        creator: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (err: any) {
    if (err.code === 'P2002') {
      throw new AppError('Slug already in use', 409);
    }
    throw err;
  }
}

export async function createPlanPaddleDb(dto: CreatePlanDto) {
  const { product, price } = await createProductWithPrice({
    name: dto.title,
    description: dto.description,
    inputPrice: dto.originalPrice ? dto.originalPrice : dto.price,
  });

  let discountId = await createDiscountFor(dto);

  try {
    return await prisma.plan.create({
      data: {
        creatorId: dto.creatorId,
        paddleProductId: product.id, //TEMP, FIRST MUST CREATE PADDLE PRODUCT.
        paddlePriceId: price.id,
        title: dto.title,
        description: dto.description,
        slug: dto.slug,
        price: dto.price,
        originalPrice: dto.originalPrice, // may be undefined
        paddleDiscountId: discountId,
        coverImage: '',
      },
      include: {
        creator: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (err: any) {
    if (err.code === 'P2002') {
      throw new AppError('Slug already in use', 409);
    }
    throw err;
  }
}

export async function getPlanFromSubWithSlug({
  subdomain,
  slug,
}: {
  subdomain: string;
  slug: string;
}) {
  const plan = await prisma.plan.findFirst({
    where: {
      slug,
      creator: {
        subdomain,
      },
    },
    include: {
      purchases: true,
      creator: {
        include: {
          user: true,
        },
      },
    },
  });
  return plan;
}

//How many plans did a creator make?
export async function countPlansByCreatorId(creatorId: number) {
  const plansCount = await prisma.plan.count({
    where: { creatorId },
  });
  return plansCount;
}

//How much sales did cratorId generate
export async function countSalesByCreatorId(creatorId: number) {
  const sales = await prisma.purchase.count({
    where: { plan: { creatorId } },
  });
  return sales;
}
export async function getPlansOwnedByUser(
  userId: number
): Promise<PlanPreview[]> {
  const purchases = await prisma.purchase.findMany({
    where: { userId },
    include: {
      plan: {
        include: {
          creator: {
            include: {
              user: true,
            },
          },
          purchases: true,
        },
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  return purchases.map((purchase) => toPlanPreview(purchase.plan));
}
export async function getPlansMadeByCreator(
  creatorId: number
): Promise<PlanWithRevenue[]> {
  const plans = await prisma.plan.findMany({
    where: { creatorId },
    orderBy: { createdAt: 'desc' },
    include: {
      creator: {
        include: {
          user: true,
        },
      },
      purchases: true,
    },
  });
  return plans.map(toPlanCreatorData);
}
export async function getCreatorIdForPlan(
  planId: number,
  tx: Prisma.TransactionClient) {
  const plan = await tx.plan.findUnique({
    where: { id: planId },
    select: { creatorId: true },
  });

  if (!plan) throw new AppError('Plan not found', 404);
  return plan.creatorId;
}

