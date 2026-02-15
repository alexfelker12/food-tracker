import { NutritionResult } from "@/generated/prisma/client"
import { MetricsProfileModel } from "@/generated/prisma/models"
import { checkCarbRestrictions, checkFatRestrictions, checkProteinRestrictions } from "@/lib/calculations/profile.v2"

//* -----------------------------
//* MAIN TYPES
//* -----------------------------

//* strategy calculation props
export type MacroCalculationContext =
  Pick<MetricsProfileModel,
    "fitnessGoal"
    | "trainingDaysPerWeek"
    | "weightKg"
    | "bodyType"
    | "gender"
    | "proteinTargetGrams"
    | "fatTargetGrams"
  > &
  Pick<NutritionResult,
    "calorieGoal"
  >

//* macro values in nutritionResult
export type MacroResult =
  Pick<NutritionResult,
    "proteinsMinGrams"
    | "proteinsMaxGrams"
    | "proteinsTargetGrams"
    | "fatsMinGrams"
    | "fatsMaxGrams"
    | "fatsTargetGrams"
    | "carbsMinGrams"
    | "carbsMaxGrams"
    | "carbsTargetGrams"
  // | ""
  >

//* each strategy has a calculate function, which returns the macro values part in a nutritionResult
export interface MacroCalculationStrategy {
  calculate(ctx: MacroCalculationContext): MacroResult
}


//* -----------------------------
//* HELPER FUNCTIONS
//* -----------------------------

interface CheckPlanValidityProps {
  context: MacroCalculationContext
  proteinGrams: number
  fatGrams: number
  carbGrams: number
}
export type CheckPlanValidityReturn = {
  isProteinAmountValid: boolean
  isFatAmountValid: boolean
  isCarbAmountValid: boolean
  isPlanValid: boolean
}
export const checkPlanValidity = ({ context, fatGrams, proteinGrams, carbGrams }: CheckPlanValidityProps): CheckPlanValidityReturn => {
  const isProteinAmountValid = checkProteinRestrictions({
    proteinGrams,
    weightKg: context.weightKg
  })

  const isFatAmountValid = checkFatRestrictions({
    fatGrams,
    gender: context.gender,
    weightKg: context.weightKg
  })

  const isCarbAmountValid = checkCarbRestrictions({ carbGrams })

  return {
    isProteinAmountValid,
    isFatAmountValid,
    isCarbAmountValid,
    //* plan is only valid if all restrictions are met
    isPlanValid: [isProteinAmountValid, isFatAmountValid, isCarbAmountValid].every((check) => check)
  }
}
