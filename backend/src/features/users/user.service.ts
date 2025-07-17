import { prisma } from '@src/utils/prisma';
import { AppError } from '@src/utils/AppError';
import fs from 'node:fs/promises';

import path from 'node:path';
import sharp from 'sharp';
import { UserDto } from '@shared/types/user';
import { toUserDTO } from '@src/features/users/user.transformer';

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

  const AVATAR_DIR = path.join(__dirname, '..', '..', '..', 'uploads', 'avatars');

  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.mimetype))
    throw new AppError('Unsupported image type', 400);

  await fs.mkdir(AVATAR_DIR, { recursive: true });

  const filename = `${userId}_${Date.now()}.webp`;
  const target = path.join(AVATAR_DIR, filename);

  const buffer = await sharp(file.buffer)
    .rotate()
    .resize({ width: 400, height: 400, fit: 'inside' })
    .webp({ quality: 80 })
    .toBuffer();

  await fs.writeFile(target, buffer);

  /* ───── 4. Delete previous avatar (best-effort) ───── */
  const old = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarUrl: true },
  });
  if (old?.avatarUrl) {
    const filename = path.basename(old.avatarUrl);

    const oldPath = path.join(AVATAR_DIR, filename);

    // 3️⃣  Delete it (ignore ENOENT)
    try {
      await fs.unlink(oldPath);
      console.log('Old avatar deleted successfuly');
    } catch (err: any) {
      if (err.code !== 'ENOENT')
        console.error('Failed to delete old avatar:', err);
    }
  }

  const relative = `/uploads/avatars/${filename}`;
  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: relative },
  });

  return relative;
};export async function getUserById(id: number): Promise<UserDto | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) return null;
  return toUserDTO(user);
}

