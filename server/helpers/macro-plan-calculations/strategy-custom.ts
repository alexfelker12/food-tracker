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
    const proteinsMinGrams = context.proteinTargetGrams * 0.95
    const proteinsMaxGrams = context.proteinTargetGrams * 1.05

    //* fats min/max range
    const fatsMinGrams = context.fatTargetGrams * 0.95
    const fatsMaxGrams = context.fatTargetGrams * 1.05

    //* calculate remaining calories & carbs target
    const proteinCalories = context.proteinTargetGrams * 4
    const fatCalories = context.fatTargetGrams * 9
    // subtract protein and fat calories from calorieGoal
    const remainingCalories = context.calorieGoal - proteinCalories - fatCalories
    const carbsTargetGrams = remainingCalories * 4

    //* carbs min/max range
    const carbsMinGrams = carbsTargetGrams * 0.95
    const carbsMaxGrams = carbsTargetGrams * 1.05

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
