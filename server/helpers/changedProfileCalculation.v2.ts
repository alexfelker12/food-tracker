import { MetricsProfileModel, NutritionResultModel } from "@/generated/prisma/models";
import {
  // base calc
  calculateBMR, calculateTDEE, calculateCalorieGoal,
  // water demand
  calculateWaterDemand,
  // split calc is done by strategy classes
} from "@/lib/calculations/profile.v2";
import { createMacroStrategy } from "./macro-plan-calculations/factory";


//* create nutrition result
// export interface ChangedProfileCalculationProps extends Omit<MetricsProfileModel, "id" | "userId"> { }
export function changedProfileCalculation(
  profileData: Omit<MetricsProfileModel, "id" | "userId">
): Omit<NutritionResultModel, "id" | "metricsProfileId" | "date"> | null {
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
  const calorieGoal = calculateCalorieGoal({ fitnessGoal, tdee })
  const { min: waterDemandMin, max: waterDemandMax } = calculateWaterDemand({
    weightKg,
    activityLevel,
    fitnessGoal,
    trainingDaysPerWeek
  })

  //* macro split values
  const macroStrategy = createMacroStrategy(macroSplit)
  const macros = macroStrategy.calculate({
    calorieGoal,
    fitnessGoal,
    trainingDaysPerWeek,
    weightKg,
    bodyType,
    gender,
    fatTargetGrams,
    proteinTargetGrams
  })

  //* invalid plan (should not happen except endpoint is triggered outside of app context)
  if (!macros) return null

  return {
    // base/general values
    bmr,
    tdee,
    calorieGoal,
    waterDemandMin,
    waterDemandMax,
    // macro splits min/max/target
    ...macros,
    // profileSnapshot
    profileSnapshot,
  }
}
