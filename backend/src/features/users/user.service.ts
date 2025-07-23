import { prisma } from '@src/utils/prisma';
import { AppError } from '@src/utils/AppError';

import { UserDto } from '@shared/types/user';
import { toUserDTO } from '@src/features/users/user.transformer';
import { storeInUploads } from '@src/utils/imageUploader';

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


export const storeAvatar = async (
  userId: number,
  file: Express.Multer.File
): Promise<string> => {

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarUrl: true },
  });

  const newUrl = await storeInUploads({
    userId,
    file,
    folder: 'avatars',
    width: 400,
    height: 400,
    oldFileUrl: user?.avatarUrl ?? undefined,
  });


  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: newUrl },
  });

  return newUrl;
};

export async function getUserById(id: number): Promise<UserDto | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) return null;
  return toUserDTO(user);
}

