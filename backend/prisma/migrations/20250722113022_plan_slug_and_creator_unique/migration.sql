/*
  Warnings:

  - A unique constraint covering the columns `[creatorId,slug]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Plan_slug_key";

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "slug" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Plan_creatorId_slug_key" ON "Plan"("creatorId", "slug");
