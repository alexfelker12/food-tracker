"use client"

import { useState } from "react";

import { useMutationState } from "@tanstack/react-query";

import { BASE_PORTION_GRAMS } from "@/lib/constants";
import { getGermanNumber } from "@/lib/utils";

import { EllipsisVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemTitle } from "@/components/ui/item";

// import { JournalEntryItemDropdown } from "./JournalEntryItemDropdown";
import { JournalDayJournalEntry, JournalEntryContext, useJournalEntry } from "./JournalEntryActions/JournalEntryContext";
import { JournalEntryItemActions } from "./JournalEntryActions/JournalEntryItemActions";


interface JournalEntryItemProps {
  journalEntry: JournalDayJournalEntry
}
export function JournalEntryItem({ journalEntry }: JournalEntryItemProps) {
  const [open, setOpen] = useState(false) // open={open} onOpenChange={setOpen}

  //* mutation state of any pending entry action
  const anyActionPending = useMutationState({
    filters: { mutationKey: [["journal", "entry"]] },
    select: (mutation) => mutation.state.status === "pending"
  }).some((pending) => pending) // TODO: check if some is correct, else use length based 

  // actions drawer
  const drawerLabel = `${journalEntry.foodEntry.name}${journalEntry.foodEntry.brand ? ` (${journalEntry.foodEntry.brand})` : ""}`

  return (
    <JournalEntryContext.Provider value={{
      journalEntry,
      closeMainDrawer: () => setOpen(false),
      anyActionPending
    }}>
      <Collapsible>
        <Item variant="muted" size="xs" className="gap-y-0">

          {/* main item */}
          <CollapsibleTrigger className="flex-1">
            <ItemContent className="items-start">
              <ItemTitle className="text-start text-wrap">{journalEntry.foodEntry.name}</ItemTitle>
              <JournalEntryItemDescription />
            </ItemContent>
          </CollapsibleTrigger>

          {/* actions (delete, update, ...) */}
          <ItemActions>
            <Drawer
              open={open}
              onOpenChange={setOpen}
              dismissible={!anyActionPending}
            >
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon"><EllipsisVerticalIcon /></Button>
              </DrawerTrigger>
              <JournalEntryItemActions label={drawerLabel} />
            </Drawer>
          </ItemActions>

          {/* item footer */}
          <JournalEntryItemContent />

        </Item>
      </Collapsible>
    </JournalEntryContext.Provider>
  );
}

function JournalEntryItemDescription() {
  const { journalEntry } = useJournalEntry()

  const portion = journalEntry.foodEntry.portionName
    // not base portion
    ? `${journalEntry.foodEntry.portionAmount}x '${journalEntry.foodEntry.portionName}'`
    // base portion
    : `${journalEntry.foodEntry.portionAmount * BASE_PORTION_GRAMS} g`

  const entryKcal = getGermanNumber(journalEntry.nutritionData.kcal)

  return (
    <ItemDescription className="inline-flex gap-1.5">
      <span>{entryKcal} kcal</span> <span>-</span> <span>{portion}</span>
    </ItemDescription>
  );
}

function JournalEntryItemContent() {
  const { journalEntry } = useJournalEntry()

  //* german format macro values
  const foodFats = getGermanNumber(journalEntry.nutritionData.fats)
  const foodCarbs = getGermanNumber(journalEntry.nutritionData.carbs)
  const foodProteins = getGermanNumber(journalEntry.nutritionData.proteins)

  return (
    <CollapsibleContent className="w-full">
      <ItemFooter className="flex-col items-start gap-1 pt-2">
        <div className="flex justify-between items-center w-full">
          <span>Carbs: {foodCarbs} g</span>
          <span>Fette: {foodFats} g</span>
          <span>Proteine: {foodProteins} g</span>
        </div>
        {journalEntry.foodEntry.brand && <span className="text-muted-foreground">Marke: {journalEntry.foodEntry.brand}</span>}
      </ItemFooter>
    </CollapsibleContent>
  );
}
