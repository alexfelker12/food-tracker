import { calculateRecommendedCarbs, calculateRecommendedFats, calculateRecommendedProteins, getMinMaxRange } from "@/lib/calculations/profile.v2"

import type { MacroCalculationContext, MacroCalculationStrategy, MacroResult } from "./context"


//* strategy RECOMMENDED
export class RecommendedMacroStrategy implements MacroCalculationStrategy {
  calculate({ bodyType, calorieGoal, fitnessGoal, gender, trainingDaysPerWeek, weightKg }: MacroCalculationContext): MacroResult {
    const recommendedProteins = calculateRecommendedProteins({ fitnessGoal, trainingDaysPerWeek, weightKg, })
    const proteins = getMinMaxRange(recommendedProteins)

    const recommendedFats = calculateRecommendedFats({ bodyType, gender, weightKg, })
    const fats = getMinMaxRange(recommendedFats)

    const recommendedCarbs = calculateRecommendedCarbs({ calorieGoal, recommendedProteins, recommendedFats, })
    const carbs = getMinMaxRange(recommendedCarbs)

    return {
      proteinsMinGrams: proteins.min,
      proteinsMaxGrams: proteins.max,
      proteinsTargetGrams: recommendedProteins,

      fatsMinGrams: fats.min,
      fatsMaxGrams: fats.max,
      fatsTargetGrams: recommendedFats,

      carbsMinGrams: carbs.min,
      carbsMaxGrams: carbs.max,
      carbsTargetGrams: recommendedCarbs,
    }
  }
}
