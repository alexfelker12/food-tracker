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
import { FoodTrackMenu } from "@/components/track/FoodTrackMenu";


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
      kcal: +(accumulator.kcal + (currentValue.nutritionData?.kcal || 0)).toFixed(0),
      fats: +(accumulator.fats + (currentValue.nutritionData?.fats || 0)).toFixed(1),
      carbs: +(accumulator.carbs + (currentValue.nutritionData?.carbs || 0)).toFixed(1),
      proteins: +(accumulator.proteins + (currentValue.nutritionData?.proteins || 0)).toFixed(1),
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
      className={cn("relative space-y-2 shadow-2xs p-2 pb-3 border rounded-md", className)}
      aria-label={label}
      {...props}
    >
      <div className="flex justify-between items-center">

        <div className="space-y-0.5 w-full leading-none">
          <h3 className="px-1 text-accent-foreground text-base">{label}</h3>
          <div className="pl-1 text-muted-foreground text-sm leading-none">
            {macroSum.kcal
              ?
              <div className="inline-flex items-center gap-2 w-full h-3.5">
                <span className="w-17 text-center text-ellipsis whitespace-nowrap overflow-hidden">
                  <span className="text-foreground">{macroSum.kcal}</span> <span className="text-xs">kcal</span>
                </span>

                <Separator orientation="vertical" className="h-full" />

                <div className="flex flex-1 items-center gap-x-2">
                  <MacroDisplay className="text-label-carbs" macroValue={groupCarbs} />
                  <MacroDisplay className="text-label-fats" macroValue={groupFats} />
                  <MacroDisplay className="text-label-proteins" macroValue={groupProteins} />
                </div>
              </div>
              :
              <span>-</span>
            }
          </div>
        </div>

        <div className="-top-2 -right-1 z-0 absolute">
          <FoodTrackMenu preselectedIntakeTime={value}>
            <Button variant="outline" size="xs" background="floating">
              <PlusIcon /> Tracken
            </Button>
          </FoodTrackMenu>
        </div>
      </div>

      <div className="px-1"><Separator /></div>

      <JournalEntries journalEntries={journalEntries} />
    </section>
  );
}

function JournalEntries({ journalEntries }: Pick<JournalEntryGroupProps, "journalEntries">) {
  if (journalEntries.length === 0) return <JournalEntryGroupEmpty />

  return (
    <ItemGroup className="gap-1.5 px-1">
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

interface MacroDisplayProps extends React.ComponentProps<"div"> { macroValue: string }
function MacroDisplay({ macroValue, className, ...props }: MacroDisplayProps) {
  return (
    <span className={cn("flex flex-1 justify-center", className)} {...props}>{macroValue} g</span>
  );
}
