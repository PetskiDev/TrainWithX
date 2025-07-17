import { prisma } from '@src/utils/prisma';
import { CreatorPostDTO } from '@shared/types/creator';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError } from '@src/utils/AppError';

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
export async function promoteUserToCreator(userId: number, subdomain: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      const creator = await tx.creator.create({
        data: {
          id: userId,
          subdomain: subdomain.toLowerCase(),
          yearsXP: 0,
        },
        include: { user: true },
      });

      await tx.user.update({
        where: { id: userId },
        data: { isCreator: true },
      });

      return creator;
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      const dup = (err.meta?.target as string[]) ?? [];
      if (dup.includes('id')) {
        throw new AppError('User is already a creator.', 409);
      }
      if (dup.includes('subdomain')) {
        throw new AppError('Subdomain already taken.', 409);
      }
      throw new AppError('Duplicate creator data.', 409);
    }
    throw err;
  }
}


