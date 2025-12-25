"use client"

import { intakeTimeLabels } from "@/schemas/labels/journalEntrySchemaLabels"

import { useIntakeTimeParam } from "@/hooks/useIntakeTimeParam"

import { Badge } from "@/components/ui/badge"


export function CurrentPreselection() {
  const { intakeTime } = useIntakeTimeParam()

  if (!intakeTime) return <div data-preselection="false" /> // always render an element for styling consistency

  return (
    <Badge
      className="bg-accent text-accent-foreground text-sm"
      data-preselection="true"
    >
      {intakeTimeLabels[intakeTime]}
    </Badge>
  )
}
