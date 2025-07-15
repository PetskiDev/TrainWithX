import { User, Creator } from '@prisma/client';
import { UserDto } from '@shared/types/user';

export function transformUserToPreview(
  user: User & { creator?: Creator | null }
): UserDto {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    isCreator: !!user.creator,
    createdAt: user.createdAt,
    avatarUrl: user.avatarUrl ?? undefined,
    isVerified: user.isVerified,
  };
}

export function transformUsersToPreview(
  users: (User & { creator?: Creator | null })[]
): UserDto[] {
  return users.map(transformUserToPreview);
}
