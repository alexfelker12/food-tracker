"use client"

import { IntakeTime } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ItemGroup } from "@/components/ui/item";

import { JournalDayJournalEntries } from "./JournalEntryActions/JournalEntryContext";
import { JournalEntryItem } from "./JournalEntryItem";
import { JournalEntryGroupEmpty } from "./JournalEntryGroupEmpty";


export interface JournalEntryGroupProps extends React.ComponentProps<typeof AccordionItem> {
  label: string
  value: IntakeTime
  journalEntries: JournalDayJournalEntries
}

export function JournalEntryGroup({
  label, journalEntries,
  className, ...props
}: JournalEntryGroupProps) {
  return (
    <AccordionItem
      className={cn("", className)}
      {...props}
    >
      <AccordionTrigger className="text-base">{label}</AccordionTrigger>
      <AccordionContent>
        <JournalEntriesMap journalEntries={journalEntries} />
      </AccordionContent>
    </AccordionItem>
  );
}

function JournalEntriesMap({ journalEntries }: Pick<JournalEntryGroupProps, "journalEntries">) {
  if (journalEntries.length === 0) return <JournalEntryGroupEmpty />

  return (
    <ItemGroup className="gap-2">
      {journalEntries.map((entry) => (
        <JournalEntryItem key={entry.id} journalEntry={entry} />
      ))}
    </ItemGroup>
  );
}
