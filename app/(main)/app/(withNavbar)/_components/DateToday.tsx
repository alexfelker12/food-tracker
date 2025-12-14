"use client"

import { getGermanDate } from "@/lib/utils"

export function DateToday() {
  const date = new Date()
  const germanDate = getGermanDate(date)

  return (
    <span>{germanDate}</span>
  )
}