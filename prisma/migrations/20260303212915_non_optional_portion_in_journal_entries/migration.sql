/*
  Warnings:

  - Made the column `foodPortionId` on table `FoodJournalEntry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mealPortionId` on table `MealJournalEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FoodJournalEntry" DROP CONSTRAINT "FoodJournalEntry_foodPortionId_fkey";

-- DropForeignKey
ALTER TABLE "MealJournalEntry" DROP CONSTRAINT "MealJournalEntry_mealPortionId_fkey";

-- AlterTable
ALTER TABLE "FoodJournalEntry" ALTER COLUMN "foodPortionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MealJournalEntry" ALTER COLUMN "mealPortionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "FoodJournalEntry" ADD CONSTRAINT "FoodJournalEntry_foodPortionId_fkey" FOREIGN KEY ("foodPortionId") REFERENCES "FoodPortion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealJournalEntry" ADD CONSTRAINT "MealJournalEntry_mealPortionId_fkey" FOREIGN KEY ("mealPortionId") REFERENCES "MealPortion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
