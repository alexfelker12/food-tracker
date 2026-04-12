import { NutrientType } from "./nutrient.types"

export const nutrientPresets: Record<
  NutrientType,
  { unit: string; label: string }
> = {
  calories: { unit: "kcal", label: "Kalorien" },
  proteins: { unit: "gramm", label: "Proteine" },
  carbs: { unit: "gramm", label: "Carbs" },
  fats: { unit: "gramm", label: "Fette" },
}
