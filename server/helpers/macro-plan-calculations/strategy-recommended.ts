import { calculateFinalCalorieGoal, calculateRecommendedCarbs, calculateRecommendedFats, calculateRecommendedProteins, getMinMaxRange } from "@/lib/calculations/profile"

import type { MacroCalculationContext, MacroCalculationStrategy, MacroResult } from "./context"


//* strategy RECOMMENDED
export class RecommendedMacroStrategy implements MacroCalculationStrategy {
  calculate({ bodyType, calorieGoalInitial, fitnessGoal, gender, trainingDaysPerWeek, weightKg }: MacroCalculationContext): MacroResult {
    const recommendedProteins = calculateRecommendedProteins({ fitnessGoal, trainingDaysPerWeek, weightKg, })
    const proteins = getMinMaxRange(recommendedProteins)
    const proteinsMinGrams = proteins.min
    const proteinsMaxGrams = proteins.max

    const recommendedFats = calculateRecommendedFats({ bodyType, gender, weightKg, fitnessGoal })
    const fats = getMinMaxRange(recommendedFats)
    const fatsMinGrams = fats.min
    const fatsMaxGrams = fats.max

    const recommendedCarbs = calculateRecommendedCarbs({ calorieGoalInitial, recommendedProteins, recommendedFats, })
    const carbs = getMinMaxRange(recommendedCarbs)
    const carbsMinGrams = carbs.min
    const carbsMaxGrams = carbs.max

    const minMaxMacros = {
      proteinsMinGrams,
      proteinsMaxGrams,
      fatsMinGrams,
      fatsMaxGrams,
      carbsMinGrams,
      carbsMaxGrams
    }

    //* calorieGoal range
    const { min: calorieGoalMax, max: calorieGoalMin } = calculateFinalCalorieGoal(minMaxMacros)
    const calorieGoalTarget = (calorieGoalMax + calorieGoalMin) / 2 // simple average of min and max

    return {
      calorieGoalMax,
      calorieGoalMin,
      calorieGoalTarget,

      ...minMaxMacros,

      proteinsTargetGrams: recommendedProteins,
      fatsTargetGrams: recommendedFats,
      carbsTargetGrams: recommendedCarbs,
    }
  }
}
