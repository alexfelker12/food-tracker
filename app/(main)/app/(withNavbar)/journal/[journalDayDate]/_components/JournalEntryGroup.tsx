"use client"

import { IntakeTime } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { JournalDayEntriesByDateReturn } from "@/orpc/router/journal/day/getEntries";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ItemGroup } from "@/components/ui/item";

import { JournalEntryItem } from "./JournalEntryItem";
import { JournalDayJournalEntries } from "./JournalEntryActions/JournalEntryContext";


interface JournalEntryGroupProps extends React.ComponentProps<typeof AccordionItem> {
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
        <ItemGroup className="gap-2">
          {journalEntries.map((entry) => (
            <JournalEntryItem key={entry.id} journalEntry={entry} />
          ))}
        </ItemGroup>
      </AccordionContent>
    </AccordionItem>
  );
}
