"use client"

import { useTrackingDayParam } from "@/hooks/useTrackingDayParam"

import { Badge } from "@/components/ui/badge"
import { getGermanDate } from "@/lib/utils"


export function TrackingDay() {
  const { trackingDay } = useTrackingDayParam()

  if (!trackingDay) return <div data-trackingday="false" /> // always render an element for styling consistency

  const germanDate = getGermanDate(new Date(trackingDay))

  return (
    <Badge
      variant="secondary"
      className="text-sm"
      data-trackingday="true"
    >
      {germanDate}
    </Badge>
  )
}
