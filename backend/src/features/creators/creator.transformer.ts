// backend/src/features/creators/creator.transformer.ts
import type { Creator, User } from '@prisma/client';
import { CreatorFullDTO, CreatorPreviewDTO } from '@shared/types/creator';
import {
  getNoBuys as getTotalSales,
  getNoPlansOwnded,
} from '@src/features/creators/creator.service';
import { prisma } from '@src/utils/prisma';

export async function transformCreatorToPreview(
  creator: Creator & { user: User }
): Promise<CreatorPreviewDTO> {
  const [totalSales, plansCount] = await Promise.all([
    getTotalSales(creator.id),
    getNoPlansOwnded(creator.id),
  ]);
  return {
    id: creator.id,
    username: creator.user.username,
    subdomain: creator.subdomain,
    coverUrl: creator.coverUrl ?? undefined,
    bio: creator.bio ?? undefined,
    avatarUrl: creator.user.avatarUrl ?? undefined,
    totalSales: totalSales,
    plansCount: plansCount,
    yearsXP: creator.yearsXP ?? undefined,
    rating: 5, // TODO: Replace with actual rating logic when implemented
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
    profileViews: 123, // TODO: replace with real analytics
    totalRevenue: Number(revenueResult._sum.amount ?? 0),
    revenueThisMonth: Number(revenueThisMonth._sum.amount ?? 0),
  };
}
