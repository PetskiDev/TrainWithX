-- AlterTable
ALTER TABLE "Creator" ADD COLUMN     "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[];
