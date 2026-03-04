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
DROP COLUMN "proteins";

-- DropTable
DROP TABLE "ConsumableReference";
