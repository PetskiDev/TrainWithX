import { getDashboardStats } from '@src/features/admin/admin.service';
import { Request, Response } from 'express';

export const adminDashboardController = async (req: Request, res: Response) => {
  const stats = await getDashboardStats();
  res.json(stats);
};
