/*
  Warnings:

  - You are about to drop the column `specialization` on the `CreatorApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CreatorApplication" DROP COLUMN "specialization",
ADD COLUMN     "specialties" TEXT[];
