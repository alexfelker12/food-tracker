"use client"

import { JournalDayMacros } from "../journal/[journalDayDate]/_components/JournalDayMacros"

export function OpenMacrosWidgetClient() {
  const date = new Date()

  return (
    <JournalDayMacros date={date} />
  )
}
