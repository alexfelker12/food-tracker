/*
  Warnings:

  - You are about to drop the column `carbSplit` on the `MetricsProfile` table. All the data in the column will be lost.
  - You are about to drop the column `fatSplit` on the `MetricsProfile` table. All the data in the column will be lost.
  - You are about to drop the column `proteinSplit` on the `MetricsProfile` table. All the data in the column will be lost.
  - You are about to drop the column `amountCarbs` on the `NutritionResult` table. All the data in the column will be lost.
  - You are about to drop the column `amountFats` on the `NutritionResult` table. All the data in the column will be lost.
  - You are about to drop the column `amountProtein` on the `NutritionResult` table. All the data in the column will be lost.
  - You are about to drop the column `caloryGoal` on the `NutritionResult` table. All the data in the column will be lost.
  - You are about to drop the column `tefQuota` on the `NutritionResult` table. All the data in the column will be lost.
  - You are about to drop the column `usedRecommendedSplits` on the `NutritionResult` table. All the data in the column will be lost.
  - You are about to drop the column `waterDemand` on the `NutritionResult` table. All the data in the column will be lost.
  - Added the required column `calorieGoalInitial` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calorieGoalMax` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calorieGoalMin` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calorieGoalTarget` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbsMaxGrams` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbsMinGrams` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbsTargetGrams` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatsMaxGrams` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatsMinGrams` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatsTargetGrams` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proteinsMaxGrams` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proteinsMinGrams` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proteinsTargetGrams` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waterDemandMax` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waterDemandMin` to the `NutritionResult` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MacroSplit" AS ENUM ('RECOMMENDED', 'CUSTOM');

-- CreateEnum
CREATE TYPE "BodyMetricType" AS ENUM ('WEIGHT_KG');

-- AlterTable
ALTER TABLE "MetricsProfile" DROP COLUMN "carbSplit",
DROP COLUMN "fatSplit",
DROP COLUMN "proteinSplit",
ADD COLUMN     "fatTargetGrams" INTEGER,
ADD COLUMN     "macroSplit" "MacroSplit" NOT NULL DEFAULT 'RECOMMENDED',
ADD COLUMN     "proteinTargetGrams" INTEGER;

-- AlterTable
ALTER TABLE "NutritionResult" DROP COLUMN "amountCarbs",
DROP COLUMN "amountFats",
DROP COLUMN "amountProtein",
DROP COLUMN "caloryGoal",
DROP COLUMN "tefQuota",
DROP COLUMN "usedRecommendedSplits",
DROP COLUMN "waterDemand",
ADD COLUMN     "calorieGoalInitial" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "calorieGoalMax" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "calorieGoalMin" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "calorieGoalTarget" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "carbsMaxGrams" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "carbsMinGrams" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "carbsTargetGrams" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fatsMaxGrams" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fatsMinGrams" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fatsTargetGrams" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "proteinsMaxGrams" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "proteinsMinGrams" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "proteinsTargetGrams" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "waterDemandMax" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "waterDemandMin" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "BodyMeasurement" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "type" "BodyMetricType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BodyMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BodyMeasurement_userId_date_idx" ON "BodyMeasurement"("userId", "date");

-- CreateIndex
CREATE INDEX "BodyMeasurement_userId_type_idx" ON "BodyMeasurement"("userId", "type");

-- AddForeignKey
ALTER TABLE "BodyMeasurement" ADD CONSTRAINT "BodyMeasurement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
