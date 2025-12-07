"use client"

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { Separator } from "@/components/ui/separator";
import { JournalDayEmpty } from "./JournalDayEmpty";


export type JournalDayProps = {
  date: Date
}
export function JournalDay({ date }: JournalDayProps) {
  const { data: journalDayWithEntries } = useSuspenseQuery(orpc.journal.day.get.queryOptions({
    input: { date }
  }))

  console.log("journalDayWithEntries:", journalDayWithEntries)

  if (!journalDayWithEntries) return <JournalDayEmpty journalDayDate={date} />

  return (
    <div className="space-y-2">
      <div>
        {/* <h2 className="font-semibold text-xl">{}</h2>
        <p className="text-base text-muted-foreground">{}</p> */}
      </div>

      <Separator />

      {/* ... */}

    </div>
  );
}
