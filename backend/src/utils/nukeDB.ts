// scripts/wipe.ts
import { prisma } from '@backend/utils/prisma';
import { Request, Response } from 'express';
export const nukeDB = async function (req: Request, res: Response) {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Purchase",
      "Plan",
      "Creator",
      "User"
    RESTART IDENTITY CASCADE;
  `);

  res.status(200).send('SUCCESS NUKE');
};
