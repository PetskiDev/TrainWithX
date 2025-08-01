import { User, Creator } from '@prisma/client';
import { UserDto } from '@trainwithx/shared';

export function toUserDTO(user: User): UserDto {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    isCreator: user.isCreator,
    createdAt: user.createdAt,
    avatarUrl: user.avatarUrl ?? undefined,
    isVerified: user.isVerified,
    isActive: user.isActive,
  };
}

export function toUsersDTO(users: User[]): UserDto[] {
  return users.map(toUserDTO);
}
