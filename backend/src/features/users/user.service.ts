import {
  transformUsersToPreview,
  transformUserToPreview,
} from '@src/features/users/user.transformer';
import { prisma } from '@src/utils/prisma';
import { UserDto } from '@shared/types/user';

export async function fetchAllUsers(): Promise<UserDto[]> {
  const users = await prisma.user.findMany();
  return transformUsersToPreview(users);
}

export async function fetchUser(id: number): Promise<UserDto | null> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  return transformUserToPreview(user);
}

export async function promoteUserToCreator(id: number) {
  //todo
}

export async function getPlansByUserId(id: number) {
  //todo
}
