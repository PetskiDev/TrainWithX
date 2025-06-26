// backend/src/features/creators/creator.transformer.ts
import type { Creator, User } from '@prisma/client';
import { CreatorPreview } from '@shared/types/creator';

export function transformCreatorToPreview(
  creator: Creator & { user: User }
): CreatorPreview {
  return {
    id: creator.id,
    username: creator.user.username,
    email: creator.user.email,
    subdomain: creator.subdomain,
    avatarUrl: creator.avatarUrl,
    coverUrl: creator.coverUrl,
    bio: creator.bio,
  };
}
