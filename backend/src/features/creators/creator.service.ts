import { prisma } from '@backend/utils/prisma';
import { AppError } from '@backend/utils/AppError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function fetchAllCreators() {
  return prisma.creator.findMany({
    include: { user: true },
  });
}

export async function upgradeUser(userId: number, subdomain: string) {
  try {
    return await prisma.creator.create({
      data: { id: userId, subdomain },
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

// export async function fetchCreatorPlans(username: string) {
//   const creator = await prisma.creator.findFirst({
//     where: { user: { username } },
//     include: { plans: true },
//   });

//   if (!creator) throw new AppError('Creator not found', 404);
//   return creator.plans;
// }

// export async function fetchCreatorPlanBySlug(username: string, slug: string) {
//   const plan = await prisma.plan.findFirst({
//     where: {
//       slug,
//       creator: { user: { username } },
//     },
//   });

//   if (!plan) throw new AppError('Plan not found', 404);
//   return plan;
// }
