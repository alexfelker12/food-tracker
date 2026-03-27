"use client"

import { intakeTimeLabels } from "@/schemas/labels/journalEntrySchemaLabels"

import { useIntakeTimeParam } from "@/hooks/useIntakeTimeParam"

import { Badge } from "@/components/ui/badge"


export function IntakeTimeBadge() {
  const { intakeTime } = useIntakeTimeParam()

  if (!intakeTime) return null

  return (
    <Badge
      className="bg-accent text-accent-foreground text-sm"
      data-intaketime="true"
    >
      {intakeTimeLabels[intakeTime]}
    </Badge>
  )
}
