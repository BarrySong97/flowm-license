-- AlterTable
ALTER TABLE "License" ADD COLUMN     "mac_ids" TEXT[] DEFAULT ARRAY[]::TEXT[];
