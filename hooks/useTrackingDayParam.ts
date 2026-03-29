"use client"

import { isValidJournalDayDate } from "@/lib/utils"
import { useSearchParams } from "next/navigation"


type UseTrackingDayParamReturn = {
  trackingDay: string | null
  trackingDayKey: string
}
export function useTrackingDayParam(): UseTrackingDayParamReturn {
  const trackingDayKey = "trackingday"
  const searchParams = useSearchParams()

  // check if tracking day has correct format (regex in isValidJournalDayDate)
  const trackingDayParam = searchParams.get(trackingDayKey)
  const trackingDay = trackingDayParam && isValidJournalDayDate(trackingDayParam)
    ? trackingDayParam
    : null

  return { trackingDay, trackingDayKey }
}
