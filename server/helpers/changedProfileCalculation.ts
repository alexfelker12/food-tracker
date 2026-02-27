import { Prisma } from "@/generated/prisma/client";
import { MetricsProfileModel } from "@/generated/prisma/models";

import {
  // base calc
  calculateBMR,
  calculateCalorieGoal,
  calculateTDEE,
  // water demand
  calculateWaterDemand,
} from "@/lib/calculations/profile";

import { checkPlanValidity, MacroCalculationContext } from "./macro-plan-calculations/context";
import { createMacroStrategy } from "./macro-plan-calculations/factory";


//* create nutrition result
// export interface ChangedProfileCalculationProps extends Omit<MetricsProfileModel, "id" | "userId"> { }
export type NutritionResultData = Prisma.NutritionResultCreateWithoutMetricsProfileInput
export type ChangedProfileCalculationProps = Omit<MetricsProfileModel, "id" | "userId">
export function changedProfileCalculation(profileData: ChangedProfileCalculationProps) {
  const {
    birthDate, gender, heightCm, weightKg, bodyType,
    activityLevel, fitnessGoal, trainingDaysPerWeek,
    macroSplit, proteinTargetGrams, fatTargetGrams
  } = profileData
  // convert birthDate to ISO string to conform to prismas json type
  const profileSnapshot = { ...profileData, birthDate: birthDate.toISOString() }

  //* base/general values
  const bmr = calculateBMR({ birthDate, gender, heightCm, weightKg })
  const tdee = calculateTDEE({ activityLevel, bmr })
  const calorieGoalInitial = calculateCalorieGoal({ fitnessGoal, tdee })
  const { min: waterDemandMin, max: waterDemandMax } = calculateWaterDemand({
    weightKg,
    activityLevel,
    bodyType,
    trainingDaysPerWeek
  })

  //* macro split values
  const context: MacroCalculationContext = {
    calorieGoalInitial,
    fitnessGoal,
    trainingDaysPerWeek,
    weightKg,
    bodyType,
    gender,
    fatTargetGrams,
    proteinTargetGrams
  }
  const macroStrategy = createMacroStrategy(macroSplit)
  const macrosAndCalories = macroStrategy.calculate(context)

  //* checks if restrictions are met, implies further actions
  const planValidity = checkPlanValidity({
    context,
    proteinGrams: macrosAndCalories.proteinsTargetGrams,
    fatGrams: macrosAndCalories.fatsTargetGrams,
    carbGrams: macrosAndCalories.carbsTargetGrams
  })

  //* actual nutritionResult
  const nutritionResult: NutritionResultData = {
    // base/general values
    bmr,
    tdee,
    calorieGoalInitial,
    waterDemandMin,
    waterDemandMax,
    // macro splits min/max/target
    ...macrosAndCalories,
    // profileSnapshot
    profileSnapshot,
  }


  return { nutritionResult, planValidity }
}
