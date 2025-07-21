/*
  Warnings:

  - You are about to drop the column `certifications` on the `CreatorApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Creator" ADD COLUMN     "achievements" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "CreatorApplication" DROP COLUMN "certifications";
