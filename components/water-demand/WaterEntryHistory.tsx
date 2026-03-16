"use client"

import { useMutationState, useQuery } from "@tanstack/react-query";

import { ListWaterEntriesType } from "@/orpc/router/journal/day/water/listWater";

import { orpc } from "@/lib/orpc";

import { ListXIcon } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ItemGroup } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

import { WaterEntryItem } from "./water-entry/WaterEntryItem";
import { WaterEntryProvider } from "./water-entry/WaterEntryProvider";


export interface WaterEntryHistoryProps {
  date: Date
}
export function WaterEntryHistory({ date }: WaterEntryHistoryProps) {
  const { data: waterJournalEntries, isPending, isStale } = useQuery(orpc.journal.day.water.list.queryOptions({
    input: { date }
  }))

  if (!isPending && !waterJournalEntries) return null

  if (isPending || (isStale && waterJournalEntries.length === 0)) return <div className="place-items-center grid w-full h-[165px]">
    <Spinner className="text-primary size-6" />
  </div>

  if (waterJournalEntries.length === 0) return <WaterEntryListingEmpty />

  return <WaterEntryListing waterJournalEntries={waterJournalEntries} />
}

function WaterEntryListingEmpty() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ListXIcon />
        </EmptyMedia>
        <EmptyTitle>Kein getracktes Wasser gefunden...</EmptyTitle>
        <EmptyDescription>
          Du hast für diesen Tag kein Wasser getrackt
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function WaterEntryListing({ waterJournalEntries }: { waterJournalEntries: ListWaterEntriesType }) {
  //* mutation state of any pending water entry action
  const anyActionPending = useMutationState({
    filters: { mutationKey: [["journal", "day", "water"]] },
    select: (mutation) => mutation.state.status === "pending"
  }).at(-1) ?? false

  return (
    <ItemGroup className="gap-1.5">
      {waterJournalEntries.map((waterJournalEntry) => (
        <WaterEntryProvider key={waterJournalEntry.id} value={{ waterJournalEntry, anyActionPending }}>
          <WaterEntryItem />
        </WaterEntryProvider>
      ))}
    </ItemGroup>
  );
}
