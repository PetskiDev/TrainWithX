/*
  Warnings:

  - You are about to drop the column `price` on the `Purchase` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paddleOrderId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paddleOrderId` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "price",
ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "paddleOrderId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_paddleOrderId_key" ON "Purchase"("paddleOrderId");
