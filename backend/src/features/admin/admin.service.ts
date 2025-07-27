import { prisma } from '@src/utils/prisma';
import { subMonths, startOfMonth } from 'date-fns';
import { AdminInfoDTO } from '@trainwithx/shared';
import { UserDto } from '@trainwithx/shared';
import { toUsersDTO } from '@src/features/users/user.transformer';

export async function getDashboardStats(): Promise<AdminInfoDTO> {
  const startOfCurrentMonth = startOfMonth(new Date());
  const startOfLastMonth = subMonths(startOfCurrentMonth, 1);
  const [
    totalUsers,
    newUsers,
    totalCreators,
    newCreators,
    totalPlans,
    newPlans,
    totalRevenueRaw,
    newRevenueRaw,
    totalBuys,
    newBuys,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { createdAt: { gte: startOfCurrentMonth } },
    }),
    prisma.creator.count(),
    prisma.creator.count({
      where: { becomeCreator: { gte: startOfCurrentMonth } },
    }),
    prisma.plan.count(),
    prisma.plan.count({
      where: { createdAt: { gte: startOfCurrentMonth } },
    }),
    prisma.purchase.aggregate({
      _sum: { amount: true },
    }),
    prisma.purchase.aggregate({
      _sum: { amount: true },
      where: { timestamp: { gte: startOfLastMonth } },
    }),
    prisma.purchase.count(),
    prisma.purchase.count({
      where: { timestamp: { gte: startOfLastMonth } },
    }),
  ]);
  return {
    totalUsers,
    newUsers,
    totalCreators,
    newCreators,
    totalPlans,
    newPlans,
    totalRevenue: totalRevenueRaw._sum.amount?.toNumber() ?? 0,
    newRevenue: newRevenueRaw._sum.amount?.toNumber() ?? 0,
    totalBuys,
    newBuys,
  };
}
export async function getAllUsersAdmin(): Promise<UserDto[]> {
  const users = await prisma.user.findMany();
  return toUsersDTO(users);
}

//TODO:
// export async function promoteUserToCreator(userId: number, subdomain: string) {
//   try {
//     return await prisma.$transaction(async (tx) => {
//       const creator = await tx.creator.create({
//         data: {
//           id: userId,
//           subdomain: subdomain.toLowerCase(),
//           yearsXP: 0,
//         },
//         include: { user: true },
//       });

//       await tx.user.update({
//         where: { id: userId },
//         data: { isCreator: true },
//       });

//       return creator;
//     });
//   } catch (err) {
//     if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
//       const dup = (err.meta?.target as string[]) ?? [];
//       if (dup.includes('id')) {
//         throw new AppError('User is already a creator.', 409);
//       }
//       if (dup.includes('subdomain')) {
//         throw new AppError('Subdomain already taken.', 409);
//       }
//       throw new AppError('Duplicate creator data.', 409);
//     }
//     throw err;
//   }
// }
