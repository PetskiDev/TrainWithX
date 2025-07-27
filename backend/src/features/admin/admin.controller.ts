import { getDashboardStats } from '@src/features/admin/admin.service.js';
import { getCreatorApplications } from '../creatorApplication/creatorApplication.service.js';
import { Request, Response } from 'express';
import { getAllPlans } from '@src/features/plans/plan.service.js';
import { toPlanCreatorData } from '@src/features/plans/plan.transformer.js';
import { getAllCreators } from '@src/features/creators/creator.service.js';
import { getAllUsersAdmin } from './admin.service.js';
import { transformToCreatorFullDTO } from '@src/features/creators/creator.transformer.js';

export async function adminDashboardController(req: Request, res: Response) {
  const stats = await getDashboardStats();
  res.json(stats);
};

export async function  getCreatorApplicationsController (req: Request, res: Response) {
   const applications = await getCreatorApplications();
  res.json(applications);
}

export async function getAllPlansAdminController(req: Request, res: Response) {
  const plans = await getAllPlans();
  res.json(plans.map(toPlanCreatorData));
}

//returns FULL DTO
export async function getAllCreatorsAdminController(req: Request, res: Response) {
  const creators = await getAllCreators();
  const previews = await Promise.all(creators.map(transformToCreatorFullDTO));
  res.json(previews);
}

export async function getAllUsersAdminController (req: Request, res: Response) {
  const users = await getAllUsersAdmin();
  res.json(users);
};

//TODO:
// export async function promoteToCreatorController(req: Request, res: Response) {
//   const userId = Number(req.params.id);
//   const { subdomain } = req.body;

//   if (!userId || !subdomain) {
//     throw new AppError('userId and subdomain are required', 400);
//   }

//   const creator = await promoteUserToCreator(userId, subdomain);

//   const preview = await transformCreatorToPreview(creator);

//   res.status(201).json(preview);
// }

