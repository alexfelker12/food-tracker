
import { cn } from "@/lib/utils"
import { useMemo, useId } from "react"

import { NutrientChartProps } from "./nutrient.types"
import {
  getProgress,
  getStatus,
  getStatusColor,
  getStatusText,
  formatNumber,
} from "./nutrient.utils"

export function NutrientChart({
  current,
  min,
  max,
  unit = "",
  label = "Nutrient",
  color,
  size,
  arcStyle = "open",
  compact = false,
  showLabel = false,
  className,
}: NutrientChartProps) {
  const uniqueId = useId()

  const { percentage, status } = useMemo(() => {
    return {
      percentage: getProgress(current, min),
      status: getStatus(current, min, max),
    }
  }, [current, min, max])

  const statusColor = getStatusColor(status, color)
  const statusText = getStatusText(status, current, min, max, "")

  const gradientId = `nutrient-gradient-${uniqueId}`

  // arc configuration
  const arcConfig = arcStyle === "full"
    ? { startAngle: 90, endAngle: 450 }
    : { startAngle: 135, endAngle: 405 }
  const { startAngle, endAngle } = arcConfig
  const arcLength = endAngle - startAngle
  const progressAngle = startAngle + (arcLength * percentage) / 100

  // viewBox for responsive sizing - the SVG will scale to fit its container
  const viewBoxSize = 100
  const strokeWidth = 8
  const radius = (viewBoxSize - strokeWidth * 2) / 2
  const center = viewBoxSize / 2

  const polarToCartesian = (angle: number, r: number = radius) => {
    const rad = (angle * Math.PI) / 180
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    }
  }

  const createArc = (start: number, end: number, r: number = radius) => {
    if (arcStyle === "full" && end - start >= 360) {
      const mid = start + 180
      const startPoint = polarToCartesian(start, r)
      const midPoint = polarToCartesian(mid, r)
      const endPoint = polarToCartesian(end, r)
      return `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 0 1 ${midPoint.x} ${midPoint.y} A ${r} ${r} 0 0 1 ${endPoint.x} ${endPoint.y}`
    }
    const startPoint = polarToCartesian(start, r)
    const endPoint = polarToCartesian(end, r)
    const largeArc = end - start > 180 ? 1 : 0
    return `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y}`
  }

  const gradientStart = polarToCartesian(startAngle)
  const gradientEnd = polarToCartesian(progressAngle)

  // range text
  const rangeText = `${formatNumber(min)} - ${formatNumber(max)}`

  // container sizing - if size is provided use fixed, otherwise responsive
  const containerStyle = size
    ? { width: size, height: size }
    : { width: '100%', aspectRatio: '1 / 1' }

  return (
    <div className={cn("inline-flex relative flex-col items-center w-full @container", className)}>
      <div className="relative" style={containerStyle}>
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full h-full transform"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              x1={gradientStart.x}
              y1={gradientStart.y}
              x2={gradientEnd.x}
              y2={gradientEnd.y}
            >
              {/* <stop offset="0%" stopColor={statusColor} stopOpacity="0.6" />
              <stop offset="25%" stopColor={statusColor} stopOpacity="0.7" />
              <stop offset="50%" stopColor={statusColor} stopOpacity="0.8" />
              <stop offset="75%" stopColor={statusColor} stopOpacity="0.9" /> */}
              <stop offset="100%" stopColor={statusColor} />
            </linearGradient>
          </defs>

          {/* background track */}
          <path
            d={createArc(startAngle, endAngle)}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-muted"
          />

          {/* progress arc with gradient */}
          {percentage > 0 && (
            <path
              d={createArc(startAngle, progressAngle)}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 4px ${statusColor}50)` }}
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-[15%] text-center">
          <span
            className={cn(
              "font-bold text-[20cqw] text-foreground leading-none",
              status === "healthy" ? "text-[21cqw]" : "text-[20cqw]",
              compact && "text-[30cqw]",
              "leading-none" // for some reason leading-none gets removed/overwritten
            )}
          >
            {formatNumber(current)}
          </span>

          {!compact && (
            <>
              <span
                className="mt-0.5 font-medium text-[11cqw] leading-tight"
                style={{ color: statusColor }}
              >
                {statusText}
              </span>

              <span
                className={cn(
                  "bottom-[10%] absolute text-muted-foreground",
                  unit === "kcal" ? "text-[12cqw]" : "text-[11cqw]"
                )}
              >{unit}</span>
            </>
          )}
        </div>
      </div>

      {/* content below the chart */}
      {!compact && (
        <div className="flex flex-col items-center -mt-1">
          {showLabel && (
            <span className="font-medium text-[15cqw] text-foreground leading-[1.1]">
              {label}
            </span>
          )}

          <span className="text-[12cqw] text-muted-foreground/80">
            {rangeText}
          </span>
        </div>
      )}
    </div>
  )
}
