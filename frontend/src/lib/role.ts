import type { UserDto } from '@trainwithx/shared';

export function getUserRole(user: UserDto): 'admin' | 'creator' | 'user' {
  if (user.isAdmin) return 'admin';
  if (user.isCreator) return 'creator';
  return 'user';
}
