import { CreatorApplicationDTO, SendApplicationDTO } from '@shared/types/creator';
import { AppError } from '@src/utils/AppError';
import { prisma } from '@src/utils/prisma';


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
  const subdomainTaken = (await prisma.creator.findFirst({
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
}export async function getCreatorApplications(): Promise<
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

