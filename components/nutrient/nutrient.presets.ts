import { NutrientType } from "./nutrient.types"

export const nutrientPresets: Record<
  NutrientType,
  { unit: string; label: string }
> = {
  calories: { unit: "kcal", label: "Kalorien" },
  protein: { unit: "gramm", label: "Proteine" },
  carbs: { unit: "gramm", label: "Carbs" },
  fat: { unit: "gramm", label: "Fette" },
}
