import { prisma } from '@src/utils/prisma';
import { subMonths, startOfMonth } from 'date-fns';
import { AdminInfoDTO } from '@shared/types/admin';
import { CreatorApplicationDTO } from '@shared/types/creator';

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

export async function fetchCreatorApplications(): Promise<
  CreatorApplicationDTO[]
> {
  const applications = await prisma.creatorApplication.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return applications.map((app) => ({
    fullName: app.fullName,
    subdomain: app.subdomain,
    specialization: app.specialization,
    experience: app.experience,
    bio: app.bio,
    certifications: app.certifications || '',
    socialMedia: app.socialMedia || '',
    agreeToTerms: app.agreeToTerms,
    email: app.email,
    createdAt: app.createdAt,
    id: app.id,
  }));
}
