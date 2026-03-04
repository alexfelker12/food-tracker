-- DropForeignKey
ALTER TABLE "JournalEntry" DROP CONSTRAINT "JournalEntry_userId_fkey";

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
    "foodPortionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "portionName" TEXT,
    "portionAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FoodJournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealJournalEntry" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "mealPortionId" TEXT NOT NULL,
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
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionData" ADD CONSTRAINT "NutritionData_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodJournalEntry" ADD CONSTRAINT "FoodJournalEntry_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodJournalEntry" ADD CONSTRAINT "FoodJournalEntry_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodJournalEntry" ADD CONSTRAINT "FoodJournalEntry_foodPortionId_fkey" FOREIGN KEY ("foodPortionId") REFERENCES "FoodPortion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealJournalEntry" ADD CONSTRAINT "MealJournalEntry_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealJournalEntry" ADD CONSTRAINT "MealJournalEntry_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealJournalEntry" ADD CONSTRAINT "MealJournalEntry_mealPortionId_fkey" FOREIGN KEY ("mealPortionId") REFERENCES "MealPortion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterJournalEntry" ADD CONSTRAINT "WaterJournalEntry_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
