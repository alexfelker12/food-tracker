import { STATUS_COLORS } from "./nutrient.constants"
import { StatusLevel } from "./nutrient.types"

export function formatNumber(num: number) {
  return new Intl.NumberFormat("de-DE").format(num)
}

export function getStatus(current: number, min: number, max: number): StatusLevel {
  const criticalLow = min * 0.9
  const criticalHigh = max * 1.1

  if (current < criticalLow) return "critical-low"
  if (current < min) return "warning-low"
  if (current <= max) return "healthy"
  if (current <= criticalHigh) return "warning-high"
  return "critical-high"
}

export function getProgress(current: number, min: number) {
  return Math.min((current / min) * 100, 100)
}

export function getStatusColor(status: StatusLevel, override?: string) {
  if (override) return override

  if (status === "healthy") return STATUS_COLORS.healthy
  if (status.includes("critical")) return STATUS_COLORS.critical
  return STATUS_COLORS.warning
}

export function getStatusText(
  status: StatusLevel,
  current: number,
  min: number,
  max: number,
  unit?: string
) {
  const remaining = min - current
  const above = current - max

  const u = unit === "gramm" ? "g" : unit ?? ""

  switch (status) {
    case "critical-low":
    case "warning-low":
      return `${formatNumber(remaining)}${u} übrig`
    case "healthy":
      return unit ? "Ziel erreicht!" : ""
    case "warning-high":
    case "critical-high":
      return `${formatNumber(above)}${u} drüber`
  }
}
