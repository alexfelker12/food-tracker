"use client"

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { JournalEntry } from "@/generated/prisma/client";
import { IntakeTime as intakeTimeEnum, type IntakeTime } from "@/generated/prisma/enums";

import { Accordion } from "@/components/ui/accordion";

import { JournalDayEmpty } from "./JournalDayEmpty";
import { JournalEntryGroup } from "./JournalEntryGroup";


export type JournalDayProps = {
  date: Date
}
export function JournalDay({ date }: JournalDayProps) {
  const { data: journalDayWithEntries } = useSuspenseQuery(orpc.journal.day.getEntries.queryOptions({
    input: { date }
  }))

  if (!journalDayWithEntries) return <JournalDayEmpty journalDayDate={date} />

  //* group journal entries by their intake time
  const journalEntryGroups: Record<IntakeTime, JournalEntry[]> = {
    BREAKFAST: [],
    LUNCH: [],
    DINNER: [],
    SNACKS: []
  }
  journalDayWithEntries.journalEntries.forEach((entry) => {
    journalEntryGroups[entry.intakeTime].push(entry)
  })

  //* check for length to default open intake times that have at least one entry
  const defaultOpenIntakeTimes = Object
    .values(intakeTimeEnum)
    .flatMap((group) => journalEntryGroups[group].length > 0 ? group : [])

  {/* journal entries grouped by intaketime */ }
  return (
    <Accordion
      type="multiple"
      defaultValue={defaultOpenIntakeTimes}
    >
      <JournalEntryGroup label="Frühstück" value={intakeTimeEnum.BREAKFAST} journalEntries={journalEntryGroups.BREAKFAST} />
      <JournalEntryGroup label="Mittagessen" value={intakeTimeEnum.LUNCH} journalEntries={journalEntryGroups.LUNCH} />
      <JournalEntryGroup label="Abendessen" value={intakeTimeEnum.DINNER} journalEntries={journalEntryGroups.DINNER} />
      <JournalEntryGroup label="Snacks" value={intakeTimeEnum.SNACKS} journalEntries={journalEntryGroups.SNACKS} />
    </Accordion>
  );
}
