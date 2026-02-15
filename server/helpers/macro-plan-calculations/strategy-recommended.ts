import { calculateRecommendedCarbs, calculateRecommendedFats, calculateRecommendedProteins } from "@/lib/calculations/profile.v2"

import {
  avg,
  type MacroCalculationContext, type MacroCalculationStrategy, type MacroResult
} from "./context"


//* strategy RECOMMENDED
export class RecommendedMacroStrategy implements MacroCalculationStrategy {
  calculate(context: MacroCalculationContext): MacroResult {
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
