/*
  Warnings:

  - Made the column `yearsXP` on table `Creator` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Creator" ALTER COLUMN "yearsXP" SET NOT NULL;
