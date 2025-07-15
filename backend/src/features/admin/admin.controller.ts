import { fetchCreatorApplications, getDashboardStats } from '@src/features/admin/admin.service';
import { Request, Response } from 'express';

export const adminDashboardController = async (req: Request, res: Response) => {
  const stats = await getDashboardStats();
  res.json(stats);
};

export const getCreatorApplications = async (req: Request, res: Response) => {
   const applications = await fetchCreatorApplications();
  res.json(applications);
}


