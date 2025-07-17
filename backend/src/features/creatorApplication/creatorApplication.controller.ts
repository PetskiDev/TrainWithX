import { SendApplicationDTO } from '@shared/types/creator';
import { submitCreatorApplication } from './creatorApplication.service';
import { Request, Response } from 'express';


export async function postCreatorApplicationController(req: Request, res: Response) {
  const data = req.body as SendApplicationDTO;
  const userId = req.user!.id;
  const application = await submitCreatorApplication(
    userId,
    data
  );

  res.status(201).json(application);
}
