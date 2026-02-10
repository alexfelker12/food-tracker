import { calculateRecommendedCarbs, calculateRecommendedFats, calculateRecommendedProteins } from "@/lib/calculations/profile.v2"

import {
  avg, isPlanValid,
  type MacroCalculationContext, type MacroCalculationStrategy, type MacroResult
} from "./context"


//* strategy RECOMMENDED
export class RecommendedMacroStrategy implements MacroCalculationStrategy {
  calculate(context: MacroCalculationContext): MacroResult | null {
    const proteins = calculateRecommendedProteins({
      fitnessGoal: context.fitnessGoal,
      trainingDaysPerWeek: context.trainingDaysPerWeek,
      weightKg: context.weightKg,
    })

    const fats = calculateRecommendedFats({
      bodyType: context.bodyType,
      gender: context.gender,
      weightKg: context.weightKg,
    })

    const carbs = calculateRecommendedCarbs({
      calorieGoal: context.calorieGoal,
      recommendedProteins: proteins,
      recommendedFats: fats,
    })

    if (!isPlanValid({
      context,
      proteinGrams: avg(proteins),
      fatGrams: avg(fats),
      carbGrams: avg(carbs)
    })) return null

    return {
      proteinsMinGrams: proteins.min,
      proteinsMaxGrams: proteins.max,
      proteinsTargetGrams: avg(proteins),

      fatsMinGrams: fats.min,
      fatsMaxGrams: fats.max,
      fatsTargetGrams: avg(fats),

      carbsMinGrams: carbs.min,
      carbsMaxGrams: carbs.max,
      carbsTargetGrams: avg(carbs),
    }
  }
}
