/*
  Warnings:

  - Added the required column `tireType` to the `Tune` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tune" ADD COLUMN     "tireType" "TireType" NOT NULL;
