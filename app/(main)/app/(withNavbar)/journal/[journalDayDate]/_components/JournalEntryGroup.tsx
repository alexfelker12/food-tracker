"use client"

import { useEffect, useState } from "react";

import { IntakeTime } from "@/generated/prisma/client";

import { JournalEntriesByDateReturn } from "@/orpc/router/journal/day/getEntries";

import { cn, get_yyyymmdd_date, getGermanNumber } from "@/lib/utils";

import { ChevronDownIcon, PlusIcon } from "lucide-react";

import { FoodTrackMenu } from "@/components/track/FoodTrackMenu";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ItemGroup } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";

import { JournalEntryItem } from "./JournalEntryItem";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { Skeleton } from "@/components/ui/skeleton";


export interface JournalEntryGroupProps extends React.ComponentProps<typeof Collapsible> {
  label: string
  value: IntakeTime
  date: Date
  journalEntries: JournalEntriesByDateReturn
}
type CollapsibleState = {
  open: boolean
  manuallySet: boolean
  lastEntryCount: number
}
export function JournalEntryGroup({
  label, value, date, journalEntries,
  className, ...props
}: JournalEntryGroupProps) {
  const yyyymmdd_date = get_yyyymmdd_date(date)
  const groupStorageKey = `${yyyymmdd_date}-${value}`
  const journalEntriesCount = journalEntries.length

  const [state, setState, isHydrated] = useLocalStorageState<CollapsibleState>(
    groupStorageKey,
    {
      open: journalEntriesCount > 0,
      manuallySet: false,
      lastEntryCount: journalEntriesCount,
    }
  )

  const { open } = state

  useEffect(() => {
    setState((prev) => {
      const hasNewEntries = journalEntriesCount > prev.lastEntryCount

      if (hasNewEntries) {
        return {
          open: true,
          manuallySet: false,
          lastEntryCount: journalEntriesCount,
        }
      }

      return {
        ...prev,
        lastEntryCount: journalEntriesCount,
      }
    })
  }, [journalEntriesCount, setState])

  const handleOpenChange = (nextOpen: boolean) => {
    setState((prev) => ({
      ...prev,
      open: nextOpen,
      manuallySet: true,
    }))
  }

  if (!isHydrated) return <Skeleton className="h-15" />

  //* sum up macros and calories for this group
  const macroSum = journalEntries.reduce((accumulator, currentValue) => {
    return {
      kcal: accumulator.kcal + (currentValue.nutritionData?.kcal || 0),
      fats: accumulator.fats + (currentValue.nutritionData?.fats || 0),
      carbs: accumulator.carbs + (currentValue.nutritionData?.carbs || 0),
      proteins: accumulator.proteins + (currentValue.nutritionData?.proteins || 0),
    }
  }, {
    kcal: 0,
    fats: 0,
    carbs: 0,
    proteins: 0
  })

  const groupKcal = getGermanNumber(macroSum.kcal, 0)
  const groupFats = getGermanNumber(macroSum.fats, 0)
  const groupCarbs = getGermanNumber(macroSum.carbs, 0)
  const groupProteins = getGermanNumber(macroSum.proteins, 0)

  return (
    <Collapsible
      className={cn("relative shadow-2xs border rounded-md", className)}
      aria-label={label}
      open={open}
      onOpenChange={handleOpenChange}
      asChild
      {...props}
    >
      <section>
        <div className="flex justify-between items-center p-2">
          <CollapsibleTrigger className="w-full">
            <div className="space-y-0.5 w-full leading-none">
              <h3 className="px-1 text-accent-foreground text-base text-start">{label}</h3>
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
              <Button
                size="xs"
                variant="outline"
                background="floating"
                className="px-2"
                onClick={() => handleOpenChange(!open)}
              >
                <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                  <ChevronDownIcon className={cn(
                    "text-muted-foreground transition-transform size-4",
                    open && "rotate-180"
                  )} />
                  <span>{journalEntriesCount || "keine"}</span>
                  <span>{journalEntriesCount === 1 ? "Eintrag" : "Einträge"}</span>
                </span>
              </Button>
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
