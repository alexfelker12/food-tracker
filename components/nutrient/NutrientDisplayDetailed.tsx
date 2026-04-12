import { NutrientChart } from "./NutrientChart"
import { MacroCircleRow } from "./MacroCircleRow"
import { nutrientPresets } from "./nutrient.presets"
import { NutrientDashboardProps } from "./nutrient.types"
import { cn } from "@/lib/utils"

export function NutrientDisplayDetailed({
  calories,
  proteins,
  carbs,
  fats,
  color,
  label,
  className,
}: NutrientDashboardProps) {
  return (
    <div className={cn("space-y-2 bg-card p-4 rounded-xl", className)}>
      {label && (
        <h3 className="w-full font-semibold text-center text-lg leading-none">{label}</h3>
      )}

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
          <MacroCircleRow {...proteins} {...nutrientPresets.proteins} />
          <MacroCircleRow {...carbs} {...nutrientPresets.carbs} />
          <MacroCircleRow {...fats} {...nutrientPresets.fats} />
        </div>
      </div>
    </div>
  )
}
