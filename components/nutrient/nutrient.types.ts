export type NutrientType = "calories" | "protein" | "carbs" | "fat"

export type ArcStyle = "open" | "full"

export type StatusLevel =
  | "critical-low"
  | "warning-low"
  | "healthy"
  | "warning-high"
  | "critical-high"

export interface NutrientChartBaseProps {
  current: number
  min: number
  max: number
  unit?: string
  label?: string
  color?: string
}

export interface NutrientChartProps extends NutrientChartBaseProps {
  size?: number
  arcStyle?: ArcStyle
  compact?: boolean
  showLabel?: boolean
  className?: string
}

export interface NutrientDashboardProps {
  calories: { current: number; min: number; max: number }
  protein: { current: number; min: number; max: number }
  carbs: { current: number; min: number; max: number }
  fat: { current: number; min: number; max: number }
  label?: string
  color?: string
  className?: string
}
