"use client"

import { useSearchParams } from "next/navigation"

import type { IntakeTime } from "@/generated/prisma/enums"
import { IntakeTimeEnum } from "@/schemas/journal/journalEntrySchema"

type UseIntakeTimeParamReturn = {
  intakeTime: IntakeTime | undefined
  intakeTimeKey: string
}
export function useIntakeTimeParam(): UseIntakeTimeParamReturn {
  const intakeTimeKey = "intaketime"
  const searchParams = useSearchParams()

  const intakeTimeParam = searchParams.get(intakeTimeKey)
  const intakeTime = IntakeTimeEnum.safeParse(intakeTimeParam).data

  return { intakeTime, intakeTimeKey }
}
