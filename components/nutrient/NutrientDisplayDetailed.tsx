import { NutrientChart } from "./NutrientChart"
import { MacroCircleRow } from "./MacroCircleRow"
import { nutrientPresets } from "./nutrient.presets"
import { NutrientDashboardProps } from "./nutrient.types"
import { cn } from "@/lib/utils"

export function NutrientDisplayDetailed({
  calories,
  protein,
  carbs,
  fat,
  color,
  className,
}: NutrientDashboardProps) {
  return (
    <div className={cn("space-y-2 bg-card p-4 rounded-xl", className)}>
      <h3 className="font-semibold text-lg">Offene Nährwerte</h3>

      <div className="flex items-center gap-4">
        <div className="w-[35%] shrink-0">
          <NutrientChart
            {...calories}
            {...nutrientPresets.calories}
            color={color}
            showLabel
          />
        </div>

        <div className="flex-1 space-y-1">
          <MacroCircleRow {...protein} {...nutrientPresets.protein} />
          <MacroCircleRow {...carbs} {...nutrientPresets.carbs} />
          <MacroCircleRow {...fat} {...nutrientPresets.fat} />
        </div>
      </div>
    </div>
  )
}
