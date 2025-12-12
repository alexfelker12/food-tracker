"use client"

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { IntakeTime as intakeTimeEnum, type IntakeTime } from "@/generated/prisma/enums";

import { Accordion } from "@/components/ui/accordion";

import { JournalDayEmpty } from "./JournalDayEmpty";
import { JournalEntryGroup } from "./JournalEntryGroup";
import { JournalDayJournalEntries } from "./JournalEntryActions/JournalEntryContext";


export type JournalDayProps = {
  date: Date
}
export function JournalDay({ date }: JournalDayProps) {
  const { data: journalDayWithEntries } = useSuspenseQuery(orpc.journal.day.getEntries.queryOptions({
    input: { date }
  }))

  //TODO: handle background fetch loading state from invalidating queries

  if (!journalDayWithEntries) return <JournalDayEmpty journalDayDate={date} />

  //* group journal entries by their intake time
  const journalEntryGroups: Record<IntakeTime, JournalDayJournalEntries> = {
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
      {/* breakfast */}
      <JournalEntryGroup
        label="Frühstück"
        value={intakeTimeEnum.BREAKFAST}
        journalEntries={journalEntryGroups.BREAKFAST}
      />
      {/* lunch */}
      <JournalEntryGroup
        label="Mittagessen"
        value={intakeTimeEnum.LUNCH}
        journalEntries={journalEntryGroups.LUNCH}
      />
      {/* dinner */}
      <JournalEntryGroup
        label="Abendessen"
        value={intakeTimeEnum.DINNER}
        journalEntries={journalEntryGroups.DINNER}
      />
      {/* snacks */}
      <JournalEntryGroup
        label="Snacks"
        value={intakeTimeEnum.SNACKS}
        journalEntries={journalEntryGroups.SNACKS}
      />
    </Accordion>
  );
}
