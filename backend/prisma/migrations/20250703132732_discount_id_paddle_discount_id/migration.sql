/*
  Warnings:

  - You are about to drop the column `discountId` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "discountId",
ADD COLUMN     "paddleDiscountId" TEXT;
