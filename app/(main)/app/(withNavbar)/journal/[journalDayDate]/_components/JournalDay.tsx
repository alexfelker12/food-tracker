"use client"

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { Separator } from "@/components/ui/separator";
import { JournalDayEmpty } from "./JournalDayEmpty";
import { JournalEntryGroup } from "./JournalEntryGroup";
import { Accordion } from "@/components/ui/accordion";
import { IntakeTime as intakeTimeEnum, type IntakeTime } from "@/generated/prisma/enums";
import { JournalEntry } from "@/generated/prisma/client";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


export type JournalDayProps = {
  date: Date
}
export function JournalDay({ date }: JournalDayProps) {
  const { data: journalDayWithEntries } = useSuspenseQuery(orpc.journal.day.get.queryOptions({
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
    .keys(intakeTimeEnum)
    .flatMap((group) => journalEntryGroups[group as IntakeTime].length > 0 ? group : [])

  return (
    <div className="space-y-4">
      {/* <div>
        <h2 className="font-semibold text-xl">{}</h2>
        <p className="text-base text-muted-foreground">{}</p>
      </div> */}

      <Card className="gap-2 py-4">
        <CardHeader className="gap-0 px-4">
          <CardTitle className="text-lg leading-none">Offene Kalorien</CardTitle>
          <CardDescription className="sr-only">Zeigt die offenen Kalorien und Makrowerte für diesen Tag an</CardDescription>
        </CardHeader>
        <CardContent className="px-4">
          <p className="leading-none">Werte hier</p>
        </CardContent>
      </Card>

      <Separator />

      {/* journal entries grouped by intaketime */}
      <Accordion
        type="multiple"
        defaultValue={defaultOpenIntakeTimes}
      >
        <JournalEntryGroup label="Frühstück" value={intakeTimeEnum.BREAKFAST} journalEntries={journalEntryGroups.BREAKFAST} />
        <JournalEntryGroup label="Mittagessen" value={intakeTimeEnum.LUNCH} journalEntries={journalEntryGroups.LUNCH} />
        <JournalEntryGroup label="Abendessen" value={intakeTimeEnum.DINNER} journalEntries={journalEntryGroups.DINNER} />
        <JournalEntryGroup label="Snacks" value={intakeTimeEnum.SNACKS} journalEntries={journalEntryGroups.SNACKS} />
      </Accordion>
    </div>
  );
}
