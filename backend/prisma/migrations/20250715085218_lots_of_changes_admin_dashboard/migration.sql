/*
  Warnings:

  - Added the required column `email` to the `CreatorApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreatorApplication" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
