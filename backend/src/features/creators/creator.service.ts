import { prisma } from '@src/utils/prisma.js';
import { CreatorPostDTO, SendApplicationDTO } from '@trainwithx/shared';
import { CreatorApplication, Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError } from '@src/utils/AppError.js';
import app from '@src/app.js';
import { storeInUploads } from '@src/utils/imageUploader.js';

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

export async function editCreator(
  creatorId: number,
  data: Partial<CreatorPostDTO>
) {
  const { username, ...creatorData } = data;
  try {
    return await prisma.creator.update({
      where: { id: creatorId },
      data: {
        ...creatorData,
        ...(username && {
          user: {
            update: {
              username,
            },
          },
        }),
      },
      include: {
        user: true,
      },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      const target = err.meta?.target as string[] | undefined;
      console.log(target);
      if (target?.includes('username')) {
        throw new AppError('Username is already taken.', 409);
      }

      if (target?.includes('subdomain')) {
        throw new AppError('Subdomain is already taken.', 409);
      }

      // Fallback
      throw new AppError('Unique constraint failed.', 409);
    }
    throw err;
  }
}

export async function getCreatorBySub(subdomain: string) {
  return prisma.creator.findFirst({
    where: {
      subdomain,
    },
    include: { user: true },
  });
}

export async function promoteUserToCreator(
  application: CreatorApplication,
  tx: Prisma.TransactionClient | PrismaClient = prisma
) {
  try {
    return await tx.creator
      .create({
        data: {
          id: application.userId,
          subdomain: application.subdomain.toLowerCase(),
          yearsXP: application.experience,
          bio: application.bio,
          specialties: application.specialties,
          instagram: application.instagram,
        },
        include: { user: true },
      })
      .then(async (creator) => {
        await tx.user.update({
          where: { id: application.userId },
          data: { isCreator: true },
        });
        return creator;
      });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      const dup = (err.meta?.target as string[]) ?? [];
      if (dup.includes('id'))
        throw new AppError('User is already a creator.', 409);
      if (dup.includes('subdomain'))
        throw new AppError('Subdomain already taken.', 409);
    }
    throw err;
  }
}

export const storeCreatorCover = async (
  creatorId: number,
  file: Express.Multer.File
): Promise<string> => {
  const creator = await prisma.creator.findUnique({
    where: { id: creatorId },
    select: { coverUrl: true },
  });

  const newUrl = await storeInUploads({
    id: creatorId,
    file,
    folder: 'creator-covers',
    width: 1200,
    height: 400,
    oldFileUrl: creator?.coverUrl ?? undefined,
  });

  await prisma.creator.update({
    where: { id: creatorId },
    data: { coverUrl: newUrl },
  });

  return newUrl;
};
