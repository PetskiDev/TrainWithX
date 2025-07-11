/*
  Warnings:

  - You are about to drop the column `markdown` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `preview` on the `Plan` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('beginner', 'intermediate', 'advanced');

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "markdown",
DROP COLUMN "metadata",
DROP COLUMN "preview",
ADD COLUMN     "content" JSONB,
ADD COLUMN     "difficulty" "Difficulty";
