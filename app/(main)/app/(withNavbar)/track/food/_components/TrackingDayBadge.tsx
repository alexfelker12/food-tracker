"use client"

import { useTrackingDayParam } from "@/hooks/useTrackingDayParam"

import { Badge } from "@/components/ui/badge"
import { getGermanDate } from "@/lib/utils"


export function TrackingDayBadge() {
  const { trackingDay } = useTrackingDayParam()

  if (!trackingDay) return null

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
