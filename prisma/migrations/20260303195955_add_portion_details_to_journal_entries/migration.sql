/*
  Warnings:

  - Added the required column `portionAmount` to the `FoodJournalEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FoodJournalEntry" ADD COLUMN     "portionAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "portionName" TEXT;
