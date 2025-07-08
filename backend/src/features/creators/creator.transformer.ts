// backend/src/features/creators/creator.transformer.ts
import type { Creator, User } from '@prisma/client';
import { CreatorPreviewDTO } from '@shared/types/creator';
import {
  getNoBuys,
  getNoPlansOwnded,
} from '@src/features/creators/creator.service';

export async function transformCreatorToPreview(
  creator: Creator & { user: User }
): Promise<CreatorPreviewDTO> {
  const [noBuys, plansCount] = await Promise.all([
    getNoBuys(creator.id),
    getNoPlansOwnded(creator.id),
  ]);
  return {
    id: creator.id,
    username: creator.user.username,
    subdomain: creator.subdomain,
    coverUrl: creator.coverUrl ?? undefined,
    bio: creator.bio ?? undefined,
    avatarUrl: creator.user.avatarUrl ?? undefined,
    noBuys: noBuys,
    plansCount: plansCount,
    yearsXP: creator.yearsXP ?? undefined,
    rating: 5,
  };
}
