import { Request, Response } from 'express';
import * as creatorService from './creator.service';
import { transformCreatorToPreview } from './creator.transformer';
import { AppError } from '@backend/utils/AppError';

export async function getAllCreators(req: Request, res: Response) {
  const creators = await creatorService.fetchAllCreators();
  const previews = creators.map(transformCreatorToPreview);
  res.json(previews);
}

// export async function getCreatorPlans(req: Request, res: Response) {
//   const { username } = req.params;
//   const plans = await creatorService.getCreatorPlans(username);

//   // Optionally transform plans before returning
//   // const previews = plans.map(transformPlanToPreview);
//   // res.json(previews);

//   res.json(plans);
// }

// /**
//  * GET /creators/:username/plans/:slug
//  * Fetch one specific plan by creator and slug.
//  */
// export async function getCreatorPlanBySlug(req: Request, res: Response) {
//   const { username, slug } = req.params;
//   const plan = await creatorService.getCreatorPlanBySlug(username, slug);
//   res.json(plan);
// }
