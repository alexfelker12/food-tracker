import { getMinMaxRange } from "@/lib/calculations/profile.v2"

import {
  // isPlanValid,
  type MacroCalculationContext, type MacroCalculationStrategy, type MacroResult
} from "./context"

export class CustomMacroStrategy implements MacroCalculationStrategy {
  calculate(context: MacroCalculationContext): MacroResult {
    if (
      !context.fatTargetGrams ||
      !context.proteinTargetGrams
    ) {
      throw new Error("CUSTOM plan is missing proteinTargetGrams and/or fatTargetGrams")
    }

    //* proteins min/max range
    const { min: proteinsMinGrams, max: proteinsMaxGrams } = getMinMaxRange(context.proteinTargetGrams)

    //* fats min/max range
    const { min: fatsMinGrams, max: fatsMaxGrams } = getMinMaxRange(context.fatTargetGrams)

    //* calculate remaining calories & carbs target
    const proteinCalories = context.proteinTargetGrams * 4
    const fatCalories = context.fatTargetGrams * 9
    // subtract protein and fat calories from calorieGoal
    const remainingCalories = context.calorieGoal - proteinCalories - fatCalories
    const carbsTargetGrams = remainingCalories * 4

    //* carbs min/max range
    const { min: carbsMinGrams, max: carbsMaxGrams } = getMinMaxRange(carbsTargetGrams)

    return {
      proteinsMinGrams,
      proteinsMaxGrams,
      proteinsTargetGrams: context.proteinTargetGrams,

      fatsMinGrams,
      fatsMaxGrams,
      fatsTargetGrams: context.fatTargetGrams,

      carbsMinGrams,
      carbsMaxGrams,
      carbsTargetGrams: carbsTargetGrams,
    }
  }
}
