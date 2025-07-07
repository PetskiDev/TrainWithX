/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `Creator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Creator" DROP COLUMN "avatarUrl";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT;
