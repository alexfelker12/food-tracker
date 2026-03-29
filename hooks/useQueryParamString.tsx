"use client"

import { IntakeTime } from "@/generated/prisma/enums"

import { useIntakeTimeParam } from "./useIntakeTimeParam"
import { useTrackingDayParam } from "./useTrackingDayParam"


type UseQueryParamStringProps = {
  trackingDayString?: string | null
  intakeTimeString?: IntakeTime | undefined
}
export function useQueryParamString({ intakeTimeString, trackingDayString }: UseQueryParamStringProps) {
  // get current query params
  const { intakeTime, intakeTimeKey } = useIntakeTimeParam()
  const { trackingDay, trackingDayKey } = useTrackingDayParam()

  // array to store query param strings
  const queryParamArray = []

  // create intake time param and push to array
  const definedIntakeTime = intakeTimeString || intakeTime
  const intakeTimeParam = definedIntakeTime
    ? `${intakeTimeKey}=${definedIntakeTime}`
    : ""
  queryParamArray.push(intakeTimeParam)

  // create tracking day param and push to array
  const definedTrackingDay = trackingDayString || trackingDay
  const trackingDayParam = definedTrackingDay
    ? `${trackingDayKey}=${definedTrackingDay}`
    : ""
  queryParamArray.push(trackingDayParam)

  // filter out empty params and create a valid query param string
  const validQueryParams = queryParamArray.filter(param => param !== "")
  const queryParamString = validQueryParams.length > 0 ? `?${validQueryParams.join("&")}` : null

  return queryParamString
}
