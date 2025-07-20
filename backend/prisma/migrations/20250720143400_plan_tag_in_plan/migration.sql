-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
