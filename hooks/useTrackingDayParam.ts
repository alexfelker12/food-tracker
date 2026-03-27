"use client"

import { useSearchParams } from "next/navigation"

type UseTrackingDayParamReturn = {
  trackingDay: string | null
  trackingDayKey: string
}
export function useTrackingDayParam(): UseTrackingDayParamReturn {
  const trackingDayKey = "trackingday"
  const searchParams = useSearchParams()

  const trackingDay = searchParams.get(trackingDayKey)

  return { trackingDay, trackingDayKey }
}
