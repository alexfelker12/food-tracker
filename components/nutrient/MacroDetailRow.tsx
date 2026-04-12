import { NutrientChartBaseProps } from "./nutrient.types"
import { getProgress, getStatus, getStatusColor } from "./nutrient.utils"

export function MacroDetailRow({
  current,
  min,
  max,
  label,
  unit,
  color,
}: NutrientChartBaseProps) {
  const percentage = getProgress(current, min)
  const status = getStatus(current, min, max)
  const barColor = getStatusColor(status, color)

  const adjustedUnit = unit === "gramm" ? "g" : unit

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {current}{adjustedUnit} / {min}-{max}{adjustedUnit}
        </span>
      </div>

      <div className="bg-muted rounded-full h-1.5 overflow-hidden">
        <div
          className="rounded-full h-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
            boxShadow: `0 0 8px ${barColor}40`,
          }}
        />
      </div>
    </div>
  )
}
