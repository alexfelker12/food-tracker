import { MetricsProfileModel } from "@/generated/prisma/models"
import { checkCarbRestrictions, checkFatRestrictions, checkProteinRestrictions } from "@/lib/calculations/profile.v2"

//* -----------------------------
//* MAIN TYPES
//* -----------------------------

//* strategy calculation props
export interface MacroCalculationContext
  extends Pick<MetricsProfileModel, | "fitnessGoal" | "trainingDaysPerWeek" | "weightKg" | "bodyType" | "gender"> {
  calorieGoal: number

  // optional für CUSTOM
  proteinTargetGrams: number | null
  fatTargetGrams: number | null
}

//* macro values in nutritionResult
export interface MacroResult {
  proteinsMinGrams: number
  proteinsMaxGrams: number
  proteinsTargetGrams: number

  fatsMinGrams: number
  fatsMaxGrams: number
  fatsTargetGrams: number

  carbsMinGrams: number
  carbsMaxGrams: number
  carbsTargetGrams: number
}

//* each strategy has a calculate function, which returns the macro values part in a nutritionResult
export interface MacroCalculationStrategy {
  calculate(ctx: MacroCalculationContext): MacroResult | null
}


//* -----------------------------
//* HELPER FUNCTIONS
//* -----------------------------

export const avg = (value: {
  min: number
  max: number
}) => (value.min + value.max) / 2

interface IsPlanValidProps {
  context: MacroCalculationContext
  proteinGrams: number
  fatGrams: number
  carbGrams: number
}
export const isPlanValid = ({ context, fatGrams, proteinGrams, carbGrams }: IsPlanValidProps) => {
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

  //* plan is only valid if all restrictions are met
  return isProteinAmountValid && isFatAmountValid && isCarbAmountValid
}
