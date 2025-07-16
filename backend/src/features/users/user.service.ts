import { toUsersDTO, toUserDTO } from '@src/features/users/user.transformer';
import { prisma } from '@src/utils/prisma';
import { UserDto } from '@shared/types/user';
import { PlanCreatorData, PlanPreview } from '@shared/types/plan';
import { AppError } from '@src/utils/AppError';
import fs from 'node:fs/promises';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import path from 'node:path';
import sharp from 'sharp';
import {
  toPlanCreatorData,
  toPlanPreview,
} from '@src/features/plans/plan.transformer';

export async function fetchAllUsers(): Promise<UserDto[]> {
  const users = await prisma.user.findMany();
  return toUsersDTO(users);
}

export async function fetchUser(id: number): Promise<UserDto | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) return null;
  return toUserDTO(user);
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
              user: true,
            },
          },
          purchases: true,
        },
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  return purchases.map((purchase) => toPlanPreview(purchase.plan));
}

export async function fetchPlansMadeByCreator(
  creatorId: number
): Promise<PlanCreatorData[]> {
  const plans = await prisma.plan.findMany({
    where: { creatorId },
    orderBy: { createdAt: 'desc' },
    include: {
      creator: {
        include: {
          user: true,
        },
      },
      purchases: true, // In case you need number of purchases/sales per plan
    },
  });
  return plans.map(toPlanCreatorData);
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

const AVATAR_DIR = path.join(__dirname, '..', '..', '..', 'uploads', 'avatars');

export const storeAvatar = async (
  userId: number,
  file: Express.Multer.File
): Promise<string> => {
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
};
