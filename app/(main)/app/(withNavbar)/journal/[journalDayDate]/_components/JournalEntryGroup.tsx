"use client"

import { IntakeTime, JournalEntry } from "@/generated/prisma/client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ItemGroup } from "@/components/ui/item";

import { JournalEntryItem } from "./JournalEntryItem";


type JournalEntryGroupProps = {
  label: string
  value: IntakeTime
  journalEntries: JournalEntry[]
}
export function JournalEntryGroup({ label, value, journalEntries }: JournalEntryGroupProps) {
  return (
    <AccordionItem value={value}>
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
