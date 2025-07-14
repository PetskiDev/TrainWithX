// backend/src/features/creators/creator.transformer.ts
import type { Creator, User } from '@prisma/client';
import { CreatorFullDTO, CreatorPreviewDTO } from '@shared/types/creator';
import {
  getNoBuys as getTotalSales,
  getNoPlansOwnded,
} from '@src/features/creators/creator.service';

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
  return {
    ...preview,
    profileViews: 123, // TODO: Replace with actual profile views from DB
  };
}
