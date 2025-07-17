import { getDashboardStats } from '@src/features/admin/admin.service';
import { getCreatorApplications } from '../creatorApplication/creatorApplication.service';
import { Request, Response } from 'express';
import { getAllPlans } from '@src/features/plans/plan.service';
import { toPlanCreatorData } from '@src/features/plans/plan.transformer';
import { getAllCreators } from '@src/features/creators/creator.service';
import { transformToCreatorFullDTO } from '@src/features/creators/creator.transformer';
import { getAllUsersAdmin } from './admin.service';
import { getUserById } from '@src/features/users/user.service';
import { AppError } from '@src/utils/AppError';

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
export async function getUserByIdAdminController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id) {
    throw new AppError('ID not found', 404);
  }
  const user = await getUserById(id);
  res.json(user);
}


