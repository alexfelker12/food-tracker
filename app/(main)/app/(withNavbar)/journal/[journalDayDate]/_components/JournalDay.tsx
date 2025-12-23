"use client"

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { IntakeTime as intakeTimeEnum } from "@/generated/prisma/enums";

import { Accordion } from "@/components/ui/accordion";

import { JournalEntryGroup } from "./JournalEntryGroup";


export type JournalDayProps = {
  date: Date
}
export function JournalDay({ date }: JournalDayProps) {
  const { data: groupedJournalEntries } = useSuspenseQuery(orpc.journal.day.getEntries.queryOptions({
    input: { date }
  }))

  //TODO: handle background fetch loading state from invalidating queries

  //* check for length to default open intake times that have at least one entry
  const defaultOpenIntakeTimes = Object
    .values(intakeTimeEnum)
    .flatMap((group) => groupedJournalEntries[group].length > 0 ? group : [])

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
        journalEntries={groupedJournalEntries.BREAKFAST}
      />
      {/* lunch */}
      <JournalEntryGroup
        label="Mittagessen"
        value={intakeTimeEnum.LUNCH}
        journalEntries={groupedJournalEntries.LUNCH}
      />
      {/* dinner */}
      <JournalEntryGroup
        label="Abendessen"
        value={intakeTimeEnum.DINNER}
        journalEntries={groupedJournalEntries.DINNER}
      />
      {/* snacks */}
      <JournalEntryGroup
        label="Snacks"
        value={intakeTimeEnum.SNACKS}
        journalEntries={groupedJournalEntries.SNACKS}
      />
    </Accordion>
  );
}
