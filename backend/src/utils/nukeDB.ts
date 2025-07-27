// scripts/wipe.ts
import { prisma } from '@src/utils/prisma.js';
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
