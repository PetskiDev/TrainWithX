import {
  transformUsersToPreview,
  transformUserToPreview,
} from '@src/features/users/user.transformer';
import { prisma } from '@src/utils/prisma';
import { UserDto } from '@shared/types/user';
import { toPlanPreview } from '@src/features/plans/plan.transformer';
import { PlanPreview } from '@shared/types/plan';
import { AppError } from '@src/utils/AppError';

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

export async function getPlansOwnedByUser(
  userId: number
): Promise<PlanPreview[]> {
  const purchases = await prisma.purchase.findMany({
    where: { userId },
    include: {
      plan: {
        include: {
          creator: {
            include: {
              user: {
                select: { username: true },
              },
            },
          },
        },
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  return purchases.map(({ plan }) => ({
    id: plan.id,
    title: plan.title,
    slug: plan.slug,
    price: Number(plan.price),
    description: plan.description,
    originalPrice: plan.originalPrice ? Number(plan.originalPrice) : undefined,
    creatorUsername: plan.creator.user.username,
    creatorSubdomain: plan.creator.subdomain,
  }));
}

export async function editUsername(userId: number, newUsername: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        username: newUsername,
      },
    });
  } catch (err: any) {
    if (err.code === 'P2002' && err.meta?.target?.includes('username')) {
      throw new AppError('Username already exists', 400);
    }
    throw new AppError('Failed to update username', 500);
  }
}
