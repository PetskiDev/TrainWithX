import { prisma } from '@src/utils/prisma';
import { CreatorPostDTO } from '@shared/types/creator';

export async function getAllCreators() {
  return prisma.creator.findMany({
    include: { user: true },
  });
}

export async function getCreatorById(id: number) {
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

export async function getCreatorBySub(subdomain: string) {
  return prisma.creator.findFirst({
    where: {
      subdomain,
    },
    include: { user: true },
  });
}
