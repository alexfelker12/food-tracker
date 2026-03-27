"use client"

import { useEffect, useState } from "react";

import { IntakeTime } from "@/generated/prisma/client";

import { JournalEntriesByDateReturn } from "@/orpc/router/journal/day/getEntries";

import { cn, getGermanNumber } from "@/lib/utils";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { FoodTrackMenu } from "@/components/track/FoodTrackMenu";
import { JournalEntryItem } from "./JournalEntryItem";
import { Badge } from "@/components/ui/badge";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";


export interface JournalEntryGroupProps extends React.ComponentProps<typeof Collapsible> {
  label: string
  value: IntakeTime
  date: Date
  journalEntries: JournalEntriesByDateReturn
}

export function JournalEntryGroup({
  label, value, date, journalEntries,
  className, ...props
}: JournalEntryGroupProps) {
  const journalEntriesCount = journalEntries.length
  const [open, setOpen] = useState(() => journalEntriesCount > 0)

  useEffect(() => {
    setOpen(journalEntriesCount > 0)
  }, [journalEntriesCount])

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

  const groupKcal = getGermanNumber(macroSum.kcal)
  const groupFats = getGermanNumber(macroSum.fats)
  const groupCarbs = getGermanNumber(macroSum.carbs)
  const groupProteins = getGermanNumber(macroSum.proteins)

  return (
    <Collapsible
      className={cn("relative shadow-2xs border rounded-md", className)}
      aria-label={label}
      open={open}
      onOpenChange={setOpen}
      asChild
      {...props}
    >
      <section>
        <div className="flex justify-between items-center p-2">
          <CollapsibleTrigger className="w-full">
            <div className="space-y-0.5 w-full leading-none">
              <h3 className="space-x-2 px-1 text-accent-foreground text-base text-start">{label}</h3>
              <div className="pl-1 text-muted-foreground text-sm text-start leading-none">
                {macroSum.kcal
                  ?
                  <div className="inline-flex items-center gap-2 w-full h-3.5">
                    <span className="w-17 text-center text-ellipsis whitespace-nowrap overflow-hidden">
                      <span className="text-foreground">{groupKcal}</span> <span className="text-xs">kcal</span>
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
          </CollapsibleTrigger>

          <div className="-top-2 -right-1 z-0 absolute">
            <ButtonGroup>
              <ButtonGroupText className="bg-background dark:bg-input/30 px-2">
                <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                  <span>{journalEntriesCount || "keine"}</span>
                  <span>{journalEntriesCount === 1 ? "Eintrag" : "Einträge"}</span>
                </span>
              </ButtonGroupText>
              <FoodTrackMenu preselectedIntakeTime={value} preselectedTrackingDay={date}>
                <Button variant="outline" size="xs" background="floating">
                  <PlusIcon /> Tracken
                </Button>
              </FoodTrackMenu>
            </ButtonGroup>
          </div>
        </div>

        <CollapsibleContent>
          <div className="space-y-2 p-2 pb-3">
            <div className="px-1"><Separator /></div>
            <JournalEntries journalEntries={journalEntries} />
          </div>
        </CollapsibleContent>
      </section>
    </Collapsible>
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
