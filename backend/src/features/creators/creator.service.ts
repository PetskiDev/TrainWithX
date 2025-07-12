import { prisma } from '@src/utils/prisma';
import { AppError } from '@src/utils/AppError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function fetchAllCreators() {
  return prisma.creator.findMany({
    include: { user: true },
  });
}

export async function fetchCreatorById(id: number) {
  return prisma.creator.findFirst({
    where: {
      id,
    },
    include: { user: true },
  });
}

export async function fetchCreatorBySub(subdomain: string) {
  return prisma.creator.findFirst({
    where: {
      subdomain,
    },
    include: { user: true },
  });
}

export async function upgradeUser(userId: number, subdomain: string) {
  try {
    return await prisma.creator.create({
      data: { id: userId, subdomain: subdomain.toLowerCase() },
      include: { user: true },
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      const dup = (err.meta?.target as string[]) ?? [];
      if (dup.includes('id')) {
        throw new AppError('User is already a creator.', 409); // duplicate id
      }
      if (dup.includes('subdomain')) {
        throw new AppError('Subdomain already taken.', 409); // duplicate subdomain
      }
      throw new AppError('Creator already exists.', 409); // fallback
    }

    throw err;
  }
}

export async function getNoPlansOwnded(creatorId: number) {
  const plansCount = await prisma.plan.count({
    where: { creatorId },
  });
  return plansCount;
}

export async function getNoBuys(creatorId: number) {
  const totalBuys = await prisma.purchase.count({
    where: { plan: { creatorId } },
  });
  return totalBuys;
}
