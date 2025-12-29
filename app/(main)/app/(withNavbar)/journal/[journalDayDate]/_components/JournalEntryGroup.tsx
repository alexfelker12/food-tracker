"use client"

import { IntakeTime } from "@/generated/prisma/client";

import { JournalEntriesByDateReturn } from "@/orpc/router/journal/day/getEntries";

import { APP_BASE_URL } from "@/lib/constants";
import { cn, getGermanNumber } from "@/lib/utils";

import { PlusIcon } from "lucide-react";

import NoPrefetchLink from "@/components/NoPrefetchLink";
import { Button } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";

import { JournalEntryItem } from "./JournalEntryItem";


export interface JournalEntryGroupProps extends React.ComponentProps<"section"> {
  label: string
  value: IntakeTime
  journalEntries: JournalEntriesByDateReturn
}

export function JournalEntryGroup({
  label, value, journalEntries,
  className, ...props
}: JournalEntryGroupProps) {
  //* sum up macros and calories for this group
  const macroSum = journalEntries.reduce((accumulator, currentValue) => {
    return {
      kcal: +(accumulator.kcal + currentValue.kcal).toFixed(0),
      fats: +(accumulator.fats + currentValue.fats).toFixed(1),
      carbs: +(accumulator.carbs + currentValue.carbs).toFixed(1),
      proteins: +(accumulator.proteins + currentValue.proteins).toFixed(1),
    }
  }, {
    kcal: 0,
    fats: 0,
    carbs: 0,
    proteins: 0
  })

  const groupFats = getGermanNumber(macroSum.fats)
  const groupCarbs = getGermanNumber(macroSum.carbs)
  const groupProteins = getGermanNumber(macroSum.proteins)

  return (
    <section
      className={cn("space-y-2 shadow-2xs p-3 border rounded-md", className)}
      aria-label={label}
      {...props}
    >
      <div className="flex justify-between items-center pb-2 border-b">
        <div className="leading-none">
          <h3 className="text-base">{label}</h3>
          <span className="text-muted-foreground text-sm leading-none">
            {macroSum.kcal
              ? <span className="inline-flex items-center gap-2 h-3.5">
                <span className="min-w-15">{macroSum.kcal} Kcal</span>
                <Separator orientation="vertical" className="h-full" />
                <div className="inline-flex flex-1 items-center gap-x-2">
                  <span className="text-label-carbs">{groupCarbs}g</span>
                  <span>-</span>
                  <span className="text-label-fats">{groupFats}g</span>
                  <span>-</span>
                  <span className="text-label-proteins">{groupProteins}g</span>
                </div>
              </span>
              : "-"
            }
          </span>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <NoPrefetchLink href={APP_BASE_URL + `/track/food?intaketime=${value}`}>
            <PlusIcon />
          </NoPrefetchLink>
        </Button>
      </div>

      <JournalEntriesMap journalEntries={journalEntries} />
    </section>
  );
}

function JournalEntriesMap({ journalEntries }: Pick<JournalEntryGroupProps, "journalEntries">) {
  if (journalEntries.length === 0) return <JournalEntryGroupEmpty />

  return (
    <ItemGroup className="gap-1.5">
      {journalEntries.map((entry) => (
        <JournalEntryItem key={entry.id} journalEntry={entry} />
      ))}
    </ItemGroup>
  );
}

function JournalEntryGroupEmpty() {
  return (
    <div className="text-center text-sm">
      <span className="text-muted-foreground">Keine Einträge</span>
    </div>
  );
}

