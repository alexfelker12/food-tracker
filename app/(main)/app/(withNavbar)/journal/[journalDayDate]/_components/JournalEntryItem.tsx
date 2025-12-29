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
import { JournalDayJournalEntry, JournalEntryContext } from "./JournalEntryActions/JournalEntryContext";
import { JournalEntryItemActions } from "./JournalEntryActions/JournalEntryItemActions";


interface JournalEntryItemProps {
  journalEntry: JournalDayJournalEntry
}
export function JournalEntryItem({ journalEntry }: JournalEntryItemProps) {
  const [open, setOpen] = useState(false) // open={open} onOpenChange={setOpen}

  const portion = journalEntry.portionName
    // not base portion
    ? `${journalEntry.portionAmount}x '${journalEntry.portionName}'`
    // base portion
    : `${journalEntry.portionAmount * BASE_PORTION_GRAMS} g`

  const drawerLabel = `${journalEntry.name}${journalEntry.brand ? ` (${journalEntry.brand})` : ""}`

  //* mutation state of any pending entry action
  const anyActionPending = useMutationState({
    filters: { mutationKey: [["journal", "entry"]] },
    select: (mutation) => mutation.state.status === "pending"
  }).some((pending) => pending) // TODO: check if some is correct, else use length based 

  //* german format macro values
  const foodFats = getGermanNumber(journalEntry.fats)
  const foodCarbs = getGermanNumber(journalEntry.carbs)
  const foodProteins = getGermanNumber(journalEntry.proteins)

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
              <ItemTitle className="text-wrap">{journalEntry.name}</ItemTitle>
              <ItemDescription>{journalEntry.kcal} kcal, {portion}</ItemDescription>
            </ItemContent>
          </CollapsibleTrigger>

          <ItemActions>
            {/* <JournalEntryItemDropdown
            journalEntryId={journalEntry.id}
            currentIntakeTime={journalEntry.intakeTime}
          /> */}
            <Drawer open={open} onOpenChange={setOpen} dismissible={!anyActionPending}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon"><EllipsisVerticalIcon /></Button>
              </DrawerTrigger>
              <JournalEntryItemActions label={drawerLabel} />
            </Drawer>
          </ItemActions>

          {/* item footer */}
          <CollapsibleContent className="w-full">
            <ItemFooter className="flex-col items-start gap-1 pt-2">
              <div className="flex justify-between items-center w-full">
                <span>Kohlenhydrate: {foodCarbs} g</span>
                <span>Fette: {foodFats} g</span>
                <span>Proteine: {foodProteins} g</span>
              </div>
              {journalEntry.brand && <span className="text-muted-foreground">Marke: {journalEntry.brand}</span>}
            </ItemFooter>
          </CollapsibleContent>

        </Item>
      </Collapsible>
    </JournalEntryContext.Provider>
  );
}
