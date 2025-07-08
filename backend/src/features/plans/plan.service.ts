// backend/src/features/plans/plan.service.ts
import { prisma } from '@src/utils/prisma';
import { AppError } from '@src/utils/AppError';
import { CreatePlanDto } from '@shared/types/plan';
import { createDiscountFor, createProductWithPrice } from '@src/utils/paddle';

export async function fetchAllPlans() {
  return prisma.plan.findMany({
    include: { creator: { include: { user: true } } },
    orderBy: { id: 'desc' },
  });
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
