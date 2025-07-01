/*
  Warnings:

  - A unique constraint covering the columns `[paddleProductId]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paddleProductId` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "paddleProductId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Plan_paddleProductId_key" ON "Plan"("paddleProductId");
