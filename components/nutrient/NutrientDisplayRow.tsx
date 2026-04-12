import { cn } from "@/lib/utils";

import { NutrientChart } from "./NutrientChart";
import { NutrientDashboardProps } from "./nutrient.types";
import { nutrientPresets } from "./nutrient.presets";

export function NutrientDisplayRow({
  calories,
  proteins,
  carbs,
  fats,
  label,
  className
}: NutrientDashboardProps) {
  return (
    <div className={cn("space-y-3 bg-card p-3 rounded-xl", className)}>
      {label && (
        <h3 className="w-full font-semibold text-center text-lg leading-none">{label}</h3>
      )}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <NutrientChart
            {...calories}
            {...nutrientPresets.calories}
            // color="var(--primary)"
            showLabel
          />
        </div>
        <div className="flex-1 min-w-0">
          <NutrientChart
            {...proteins}
            {...nutrientPresets.proteins}
            // color="var(--primary)"
            showLabel
          />
        </div>
        <div className="flex-1 min-w-0">
          <NutrientChart
            {...carbs}
            {...nutrientPresets.carbs}
            // color="var(--primary)"
            showLabel
          />
        </div>
        <div className="flex-1 min-w-0">
          <NutrientChart
            {...fats}
            {...nutrientPresets.fats}
            // color="var(--primary)"
            showLabel
          />
        </div>
      </div>
    </div>
  )
}
