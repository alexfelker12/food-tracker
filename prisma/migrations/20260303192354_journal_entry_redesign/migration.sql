/*
  Warnings:

  - You are about to drop the column `brand` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `carbs` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `fats` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `kcal` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `portionAmount` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `portionName` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `proteins` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the `ConsumableReference` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConsumableReference" DROP CONSTRAINT "ConsumableReference_foodId_fkey";

-- DropForeignKey
ALTER TABLE "ConsumableReference" DROP CONSTRAINT "ConsumableReference_foodPortionId_fkey";

-- DropForeignKey
ALTER TABLE "ConsumableReference" DROP CONSTRAINT "ConsumableReference_journalEntryId_fkey";

-- DropForeignKey
ALTER TABLE "ConsumableReference" DROP CONSTRAINT "ConsumableReference_mealId_fkey";

-- DropForeignKey
ALTER TABLE "ConsumableReference" DROP CONSTRAINT "ConsumableReference_mealPortionId_fkey";

-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "brand",
DROP COLUMN "carbs",
DROP COLUMN "fats",
DROP COLUMN "kcal",
DROP COLUMN "name",
DROP COLUMN "portionAmount",
DROP COLUMN "portionName",
DROP COLUMN "proteins",
ALTER COLUMN "intakeTime" DROP DEFAULT;

-- DropTable
DROP TABLE "ConsumableReference";

-- CreateTable
CREATE TABLE "NutritionData" (
    "id" TEXT NOT NULL,
    "kcal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fats" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "carbs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "proteins" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "journalEntryId" TEXT NOT NULL,

    CONSTRAINT "NutritionData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodJournalEntry" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "foodPortionId" TEXT,
    "name" TEXT NOT NULL,
    "brand" TEXT,

    CONSTRAINT "FoodJournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealJournalEntry" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "mealPortionId" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "MealJournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterJournalEntry" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "amountMl" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WaterJournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NutritionData_journalEntryId_key" ON "NutritionData"("journalEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "FoodJournalEntry_journalEntryId_key" ON "FoodJournalEntry"("journalEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "MealJournalEntry_journalEntryId_key" ON "MealJournalEntry"("journalEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "WaterJournalEntry_journalEntryId_key" ON "WaterJournalEntry"("journalEntryId");

-- AddForeignKey
ALTER TABLE "NutritionData" ADD CONSTRAINT "NutritionData_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodJournalEntry" ADD CONSTRAINT "FoodJournalEntry_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodJournalEntry" ADD CONSTRAINT "FoodJournalEntry_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodJournalEntry" ADD CONSTRAINT "FoodJournalEntry_foodPortionId_fkey" FOREIGN KEY ("foodPortionId") REFERENCES "FoodPortion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealJournalEntry" ADD CONSTRAINT "MealJournalEntry_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealJournalEntry" ADD CONSTRAINT "MealJournalEntry_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealJournalEntry" ADD CONSTRAINT "MealJournalEntry_mealPortionId_fkey" FOREIGN KEY ("mealPortionId") REFERENCES "MealPortion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterJournalEntry" ADD CONSTRAINT "WaterJournalEntry_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
