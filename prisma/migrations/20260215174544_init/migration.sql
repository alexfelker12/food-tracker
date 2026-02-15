-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "FitnessGoal" AS ENUM ('QUICKLY_LOSE_WEIGHT', 'LOSE_WEIGHT', 'MAINTAIN', 'GAIN_WEIGHT', 'QUICKLY_GAIN_WEIGHT');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('VERY_ATHLETIC', 'ATHLETIC', 'AVERAGE', 'SLIGHTLY_OVERWEIGHT', 'MORE_OVERWEIGHT');

-- CreateEnum
CREATE TYPE "IntakeTime" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT,
    "displayUsername" TEXT,
    "role" TEXT DEFAULT 'user',
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricsProfile" (
    "id" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthDate" DATE NOT NULL,
    "heightCm" INTEGER NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "bodyType" "BodyType" NOT NULL,
    "fitnessGoal" "FitnessGoal" NOT NULL,
    "activityLevel" "ActivityLevel" NOT NULL,
    "trainingDaysPerWeek" INTEGER NOT NULL,
    "fatSplit" INTEGER NOT NULL,
    "carbSplit" INTEGER NOT NULL,
    "proteinSplit" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MetricsProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionResult" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bmr" DOUBLE PRECISION NOT NULL,
    "tdee" DOUBLE PRECISION NOT NULL,
    "caloryGoal" DOUBLE PRECISION NOT NULL,
    "tefQuota" DOUBLE PRECISION NOT NULL,
    "waterDemand" DOUBLE PRECISION NOT NULL,
    "amountFats" INTEGER NOT NULL,
    "amountCarbs" INTEGER NOT NULL,
    "amountProtein" INTEGER NOT NULL,
    "profileSnapshot" JSONB NOT NULL,
    "usedRecommendedSplits" BOOLEAN NOT NULL,
    "metricsProfileId" TEXT NOT NULL,

    CONSTRAINT "NutritionResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "kcal" DOUBLE PRECISION NOT NULL,
    "fats" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "barcodes" TEXT[],
    "userId" TEXT,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodPortion" (
    "id" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grams" DOUBLE PRECISION NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FoodPortion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealIngredient" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "grams" DOUBLE PRECISION NOT NULL,
    "portionLabel" TEXT,
    "portionFactor" DOUBLE PRECISION,

    CONSTRAINT "MealIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPortion" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grams" DOUBLE PRECISION NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MealPortion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsumableReference" (
    "id" TEXT NOT NULL,
    "foodId" TEXT,
    "foodPortionId" TEXT,
    "mealId" TEXT,
    "mealPortionId" TEXT,
    "journalEntryId" TEXT NOT NULL,

    CONSTRAINT "ConsumableReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "intakeTime" "IntakeTime" NOT NULL DEFAULT 'BREAKFAST',
    "date" DATE NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "kcal" DOUBLE PRECISION NOT NULL,
    "fats" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "proteins" DOUBLE PRECISION NOT NULL,
    "portionName" TEXT,
    "portionAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_token_idx" ON "session"("userId", "token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "MetricsProfile_userId_key" ON "MetricsProfile"("userId");

-- CreateIndex
CREATE INDEX "NutritionResult_metricsProfileId_idx" ON "NutritionResult"("metricsProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionResult_metricsProfileId_date_key" ON "NutritionResult"("metricsProfileId", "date");

-- CreateIndex
CREATE INDEX "Food_name_idx" ON "Food"("name");

-- CreateIndex
CREATE INDEX "Food_brand_idx" ON "Food"("brand");

-- CreateIndex
CREATE INDEX "FoodPortion_foodId_idx" ON "FoodPortion"("foodId");

-- CreateIndex
CREATE UNIQUE INDEX "FoodPortion_foodId_name_key" ON "FoodPortion"("foodId", "name");

-- CreateIndex
CREATE INDEX "Meal_userId_idx" ON "Meal"("userId");

-- CreateIndex
CREATE INDEX "Meal_name_idx" ON "Meal"("name");

-- CreateIndex
CREATE INDEX "MealIngredient_mealId_idx" ON "MealIngredient"("mealId");

-- CreateIndex
CREATE UNIQUE INDEX "MealPortion_mealId_name_key" ON "MealPortion"("mealId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ConsumableReference_journalEntryId_key" ON "ConsumableReference"("journalEntryId");

-- CreateIndex
CREATE INDEX "JournalEntry_userId_date_idx" ON "JournalEntry"("userId", "date");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricsProfile" ADD CONSTRAINT "MetricsProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionResult" ADD CONSTRAINT "NutritionResult_metricsProfileId_fkey" FOREIGN KEY ("metricsProfileId") REFERENCES "MetricsProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodPortion" ADD CONSTRAINT "FoodPortion_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealIngredient" ADD CONSTRAINT "MealIngredient_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealIngredient" ADD CONSTRAINT "MealIngredient_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPortion" ADD CONSTRAINT "MealPortion_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumableReference" ADD CONSTRAINT "ConsumableReference_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumableReference" ADD CONSTRAINT "ConsumableReference_foodPortionId_fkey" FOREIGN KEY ("foodPortionId") REFERENCES "FoodPortion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumableReference" ADD CONSTRAINT "ConsumableReference_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumableReference" ADD CONSTRAINT "ConsumableReference_mealPortionId_fkey" FOREIGN KEY ("mealPortionId") REFERENCES "MealPortion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumableReference" ADD CONSTRAINT "ConsumableReference_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
