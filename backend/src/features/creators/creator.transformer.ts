// backend/src/features/creators/creator.transformer.ts
import type { Creator, User } from '@prisma/client';
import { CreatorFullDTO, CreatorPreviewDTO } from '@trainwithx/shared';
import {
  countPlansByCreatorId,
  countSalesByCreatorId,
} from '../plans/plan.service.js';
import { prisma } from '@src/utils/prisma.js';

export async function transformCreatorToPreview(
  creator: Creator & { user: User }
): Promise<CreatorPreviewDTO> {
  const [totalSales, plansCount] = await Promise.all([
    countSalesByCreatorId(creator.id),
    countPlansByCreatorId(creator.id),
  ]);
  return {
    id: creator.id,
    username: creator.user.username,
    subdomain: creator.subdomain,
    coverUrl: creator.coverUrl ?? undefined,
    bio: creator.bio,
    avatarUrl: creator.user.avatarUrl ?? undefined,
    totalSales: totalSales,
    plansCount: plansCount,
    yearsXP: creator.yearsXP,
    specialties: creator.specialties,
    avgRating: creator.avgRating,
    noReviews: creator.noReviews,
    //profileViews: Math.floor(Math.random() * 1000000),
    instagram: creator.instagram ?? undefined,
    joinedAt: creator.becomeCreator,
    achievements: creator.achievements,
    certifications: creator.certifications,
  };
}

export async function transformToCreatorFullDTO(
  creator: Creator & { user: User }
): Promise<CreatorFullDTO> {
  const preview = await transformCreatorToPreview(creator);

  const revenueResult = await prisma.purchase.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      plan: {
        creator: {
          id: creator.id,
        },
      },
    },
  });
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const revenueThisMonth = await prisma.purchase.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      plan: {
        creator: {
          id: creator.id,
        },
      },
      timestamp: {
        gte: startOfMonth,
        lte: now,
      },
    },
  });

  return {
    ...preview,
    totalRevenue: Number(revenueResult._sum.amount ?? 0),
    revenueThisMonth: Number(revenueThisMonth._sum.amount ?? 0),
  };
}
