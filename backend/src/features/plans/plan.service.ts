// backend/src/features/plans/plan.service.ts
import { prisma } from '@src/utils/prisma';
import { AppError } from '@src/utils/AppError';
import { CreatePlanDto, PlanContentJSON, PlanWithRevenue, PlanPreview, PlanWeek, PlanPreviewWithProgress } from '@shared/types/plan';
import { paddle, syncPaddleForPlan } from '@src/utils/paddle';
import { toPlanCreatorData, toPlanPreview } from '@src/features/plans/plan.transformer';
import { Plan, Prisma } from '@prisma/client';
import { storeInUploads } from '@src/utils/imageUploader';

export async function getAllPlans() {
  return prisma.plan.findMany({
    include: { purchases: true, creator: { include: { user: true } } },
    orderBy: { id: 'desc' },
  });
}

export async function getPlanById(planId: number) {
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    include: {
      creator: { include: { user: true } },
      purchases: true,
    },
  });
  return plan;
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

export async function createPlanService(newPlan: CreatePlanDto) {
  const { slug, goals, weeks, ...previewData } = newPlan;

  const { paddleProductId, paddlePriceId, paddleDiscountId } = await syncPaddleForPlan(newPlan);

  const newContent: PlanContentJSON = {
    goals,
    weeks,
    totalWeeks: weeks.length,
  };

  try {
    return await prisma.plan.create({
      data: {
        slug: slug.toLowerCase(),
        ...previewData,
        paddleProductId,
        paddlePriceId,
        paddleDiscountId,
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
      throw new AppError('You have already made a plan with this slug', 409);
    }
    throw err;
  }
}


export async function updatePlanService(
  planId: number,
  updatedPlan: CreatePlanDto
) {
  const { slug, goals, weeks, originalPrice, ...rest } = updatedPlan;

  const content = {
    goals,
    weeks,
    totalWeeks: weeks.length,
  };

  try {
    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      throw new AppError('Plan not found', 404);
    }

    const { paddleProductId, paddlePriceId, paddleDiscountId } =
      await syncPaddleForPlan(updatedPlan, {
        paddleProductId: existingPlan.paddleProductId,
        paddlePriceId: existingPlan.paddlePriceId,
        price: Number(existingPlan.price),
        originalPrice: existingPlan.originalPrice !== undefined
          ? Number(existingPlan.originalPrice)
          : undefined,
      });

    const updated = await prisma.plan.update({
      where: { id: planId },
      data: {
        slug: slug.toLowerCase(),
        originalPrice: originalPrice ?? null,//forcefully remove it, undefineds are ingnored
        ...rest,
        paddleProductId,
        paddlePriceId,
        paddleDiscountId: paddleDiscountId ?? null, //forcefully remove it, undefineds are ingnored
        content: JSON.parse(JSON.stringify(content)),
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

    return updated;
  } catch (err: any) {
    if (err.code === 'P2002') {
      throw new AppError('You already have a plan with this slug', 409);
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


//TODO: OPTIMIZE THIS SHIT. BUT IT IS ONLY USED IF SOMEONE BUYS. AHHAHAH TAKE THIS. I WILL HAVE MORE ENERGY THEN
//SQL via JOIN + GROUP BY.
export async function getPlansOwnedByUser(userId: number): Promise<PlanPreviewWithProgress[]> {
  const purchases = await prisma.purchase.findMany({
    where: { userId },
    include: {
      plan: {
        include: {
          creator: { include: { user: true } },
          purchases: true,
        },
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  const planIds = purchases.map((p) => p.plan.id);

  const completions = await prisma.completion.findMany({
    where: {
      userId,
      planId: { in: planIds },
    },
    select: { planId: true },
  });

  const completionsMap = new Map<number, number>();
  for (const c of completions) {
    completionsMap.set(c.planId, (completionsMap.get(c.planId) || 0) + 1);
  }

  return purchases.map((purchase) => {
    const plan = purchase.plan;
    const content = plan.content as unknown as PlanContentJSON | null;

    let totalWorkouts = 0;
    if (content && Array.isArray(content.weeks)) {
      totalWorkouts = content.weeks
        .flatMap((w) => w.days)
        .filter((d) => d.type === 'workout').length;
    }

    const completed = completionsMap.get(plan.id) || 0;
    const progress = totalWorkouts > 0 ? completed / totalWorkouts : 0;

    return {
      ...toPlanPreview(plan),
      progress,
    };
  });
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
  tx?: Prisma.TransactionClient
): Promise<number> {
  const client = tx ?? prisma;

  const plan = await client.plan.findUnique({
    where: { id: planId },
    select: { creatorId: true },
  });

  if (!plan) throw new AppError('Plan not found', 404);
  return plan.creatorId;
}



function calculateProgress(plan: Plan): number {
  try {
    const content = plan.content as PlanContentJSON | null;
    if (!content || !Array.isArray(content.weeks)) return 0;

    const allDays = content.weeks.flatMap((w: any) => w.days);
    const workoutDays = allDays.filter((d: any) => d.type === 'workout');
    const completed = workoutDays.filter((d: any) => d.completed).length;

    return workoutDays.length === 0 ? 0 : completed / workoutDays.length;
  } catch (e) {
    return 0;
  }
}


export const storePlanImage = async (
  planId: number,
  file: Express.Multer.File
): Promise<string> => {

  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    select: { image: true },
  });

  const newUrl = await storeInUploads({
    id: planId,
    file,
    folder: 'plan-images',
    width: 2400,
    height: 800,
    oldFileUrl: plan?.image ?? undefined,
  });


  await prisma.plan.update({
    where: { id: planId },
    data: { image: newUrl },
  });

  return newUrl;
};