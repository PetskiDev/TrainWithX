import {
  transformUsersToPreview,
  transformUserToPreview,
} from '@backend/features/users/user.transformer';
import { prisma } from '@backend/utils/prisma';
import { UserPreview } from '@shared/types/user';

export async function fetchAllUsers(): Promise<UserPreview[]> {
  const users = await prisma.user.findMany();
  return transformUsersToPreview(users);
}

export async function fetchUser(id: number): Promise<UserPreview | null> {
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
