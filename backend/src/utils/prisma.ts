import { PrismaClient } from '@prisma/client';

/**
 * A single PrismaClient instance for the entire backend.
 * Prevents “Too many connections” in dev with hot-reload.
 */
export const prisma = new PrismaClient({
  log: ['error', 'warn'], // add 'query' in dev if you want
});