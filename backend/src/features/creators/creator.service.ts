import { prisma } from '@src/utils/prisma';
import { AppError } from '@src/utils/AppError';
import { CreatorPostDTO, SendApplicationDTO } from '@shared/types/creator';

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

export async function editCreator(creatorId: number, data: CreatorPostDTO) {
  //TODO, EDIT NAME IT WOULD BE PROBABLY IN CREATOR
  return prisma.creator.update({
    where: {
      id: creatorId,
    },
    data: {
      specialties: data.specialties,
      yearsXP: data.yearsXP,
      bio: data.bio,
    },
    include: {
      user: true,
    },
  });
}

export async function submitCreatorApplication(
  userId: number,
  dto: SendApplicationDTO
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
