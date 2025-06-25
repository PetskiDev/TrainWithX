// backend/src/features/plans/plan.service.ts
import { prisma } from '@backend/utils/prisma';
import { AppError } from '@backend/utils/AppError';

export interface CreatePlanDto {
  title: string;
  description: string;
  slug: string; // must be unique per platform
  price: number; // Decimal(10,2) in Prisma schema
}

export async function fetchAllPlans() {
  return prisma.plan.findMany({
    include: { creator: { include: { user: true } } },
    orderBy: { id: 'desc' },
  });
}

export async function fetchCreatorPlans(username: string) {
  const creator = await prisma.creator.findFirst({
    where: { user: { username } },
    include: {
      plans: {
        include: {
          creator: {
            include: { user: true },
          },
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

export async function createPlanSvc(creatorId: number, dto: CreatePlanDto) {
  try {
    return await prisma.plan.create({
      data: {
        title: dto.title,
        description: dto.description,
        slug: dto.slug,
        price: dto.price,
        creatorId,
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
