/*
  Warnings:

  - A unique constraint covering the columns `[userId,planId,weekId,dayId]` on the table `Completion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Completion_userId_weekId_dayId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Completion_userId_planId_weekId_dayId_key" ON "Completion"("userId", "planId", "weekId", "dayId");
