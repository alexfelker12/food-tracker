import { NutrientChart } from "./NutrientChart"
import { NutrientChartBaseProps } from "./nutrient.types"
import {
  getStatus,
  getStatusColor,
  getStatusText,
} from "./nutrient.utils"

export function MacroCircleRow({
  current,
  min,
  max,
  label,
  unit,
  color,
}: NutrientChartBaseProps) {
  const status = getStatus(current, min, max)
  const text = getStatusText(status, current, min, max, unit)
  const textColor = getStatusColor(status, color)

  const adjustedUnit = unit === "gramm" ? "g" : unit

  return (
    <div className="flex items-center gap-2">
      <NutrientChart
        current={current}
        min={min}
        max={max}
        arcStyle="full"
        compact
        className="flex-1"
      />

      <div className="flex flex-col flex-3 min-w-0">
        <div className="flex justify-between items-center h-5 text-sm">
          <span className="font-medium">{label}</span>
          <span className="mt-1 text-muted-foreground text-xs">
            {min}-{max}{adjustedUnit}
          </span>
        </div>

        <span className="text-xs" style={{ color: textColor }}>
          {text}
        </span>
      </div>
    </div>
  )
}
