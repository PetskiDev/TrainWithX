/*
  Warnings:

  - A unique constraint covering the columns `[paddlePriceId]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paddlePriceId` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "paddlePriceId" TEXT NOT NULL,
ALTER COLUMN "paddleProductId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Plan_paddlePriceId_key" ON "Plan"("paddlePriceId");
