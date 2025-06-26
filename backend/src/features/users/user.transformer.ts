import { User, Creator } from '@prisma/client';
import { UserPreview } from '@shared/types/user';

export function transformUserToPreview(
  user: User & { creator?: Creator | null }
): UserPreview {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

export function transformUsersToPreview(
  users: (User & { creator?: Creator | null })[]
): UserPreview[] {
  return users.map(transformUserToPreview);
}
