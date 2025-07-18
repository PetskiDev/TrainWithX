import { CreatorApplicationDTO, SendApplicationDTO } from '@shared/types/creator';
import { promoteUserToCreator } from '@src/features/creators/creator.service';
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
} export async function getCreatorApplications(): Promise<
  CreatorApplicationDTO[]
> {
  const applications = await prisma.creatorApplication.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: { select: { id: true, avatarUrl: true, username: true } }
    }
  });

  return applications.map((app) => ({
    fullName: app.fullName,
    subdomain: app.subdomain,
    specialties: app.specialties,
    experience: app.experience,
    bio: app.bio,
    certifications: app.certifications || '',
    socialMedia: app.socialMedia || '',
    agreeToTerms: app.agreeToTerms,
    email: app.email,
    createdAt: app.createdAt,
    id: app.id,
    userId: app.user.id,
    avatarUrl: app.user.avatarUrl ?? undefined,
    username: app.user.username,
    status: app.status,
  }));
}



export async function approveCreatorApplication(id: number) {
  const application = await prisma.creatorApplication.findUnique({
    where: { id },
  });

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  if (application.status === 'approved') {
    throw new AppError('Already approved', 400);
  }
  return await prisma.$transaction(async (tx) => {

    const creator = await promoteUserToCreator(application, tx);

    await tx.creatorApplication.update({
      where: { id },
      data: { status: 'approved' },
    });

    return creator;
  });
}

export async function rejectCreatorApplication(id: number) {
  const application = await prisma.creatorApplication.findUnique({
    where: { id },
  });

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  if (application.status === 'rejected') {
    throw new AppError('Already rejected', 400);
  }

  await prisma.creatorApplication.update({
    where: { id },
    data: { status: 'rejected' },
  });

}