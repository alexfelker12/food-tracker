"use client"

import { createContext, use } from "react";
import { JournalDayEntriesByDateReturn } from "@/orpc/router/journal/day/getEntries";


export type JournalDayJournalEntries = JournalDayEntriesByDateReturn["journalEntries"]
export type JournalDayJournalEntry = JournalDayJournalEntries[number]
type JournalEntryContextType = {
  journalEntry: JournalDayJournalEntry
  closeMainDrawer: () => void
  anyActionPending: boolean
}

export const JournalEntryContext = createContext<JournalEntryContextType | undefined>(undefined)
export function useJournalEntry() {
  const ctx = use(JournalEntryContext)
  if (!ctx) throw new Error("useJournalEntry must be used within JournalEntry")
  return ctx
}
