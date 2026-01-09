"use client"

import { JournalDayMacros } from "@/components/widgets/JournalDayMacros"

export function OpenMacrosWidgetClient() {
  const date = new Date()

  return (
    <JournalDayMacros date={date} />
  )
}
