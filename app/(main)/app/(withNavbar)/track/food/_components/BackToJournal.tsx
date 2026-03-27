"use client"

import { useTrackingDayParam } from "@/hooks/useTrackingDayParam"

import { APP_BASE_URL } from "@/lib/constants"

import { BackButton } from "@/components/BackButton"


export function BackToJournal() {
  const { trackingDay } = useTrackingDayParam()

  if (!trackingDay) return null

  const refererPath = APP_BASE_URL + `/journal/${trackingDay}`

  return <BackButton refererPath={refererPath as `/${string}`} />
}
