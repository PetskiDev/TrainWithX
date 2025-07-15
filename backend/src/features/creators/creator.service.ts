import { prisma } from '@src/utils/prisma';
import { AppError } from '@src/utils/AppError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatorApplicationDTO } from '@shared/types/creator';

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

export async function submitCreatorApplication(
  userId: number,
  dto: CreatorApplicationDTO
) {
  const existingApplication = await prisma.creatorApplication.findUnique({
    where: { userId },
  });

  if (existingApplication) {
    throw new AppError('You have already submitted an application.', 400);
  }

  // 2. Check if subdomain is already taken (by Creator or another Application)
  const subdomainTaken =
    (await prisma.creator.findFirst({
      where: { subdomain: dto.subdomain },
    })) ||
    (await prisma.creatorApplication.findFirst({
      where: { subdomain: dto.subdomain },
    }));

  if (subdomainTaken) {
    throw new AppError('Subdomain is already in use.', 400);
  }
  const application = await prisma.creatorApplication.create({
    data: {
      userId,
      ...dto,
    },
  });

  return application;
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
