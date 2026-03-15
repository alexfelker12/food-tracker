"use client"

import { ListWaterEntriesType } from "@/orpc/router/journal/day/water/listWater";
import { createContext, use } from "react";

//* ------------------ Context ------------------
interface WaterEntryContextValue {
  waterJournalEntry: ListWaterEntriesType[0]
  anyActionPending: boolean
}
const WaterEntryContext = createContext<WaterEntryContextValue | undefined>(undefined)

function useWaterEntry() {
  const ctx = use(WaterEntryContext)
  if (!ctx) throw new Error("useWaterEntry must be used within WaterEntryProvider")
  return ctx
}

//* ------------------ Provider ------------------
function WaterEntryProvider(props: React.ComponentProps<typeof WaterEntryContext.Provider>) {
  return <WaterEntryContext.Provider {...props} />
}

//* ------------------ Exports ------------------
export {
  type WaterEntryContextValue,
  useWaterEntry,
  WaterEntryProvider,
};
