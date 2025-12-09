"use client"

import { JournalEntry } from "@/generated/prisma/client";

import { BASE_PORTION_GRAMS } from "@/lib/constants";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemTitle } from "@/components/ui/item";

import { JournalEntryItemActions } from "./JournalEntryItemActions";
import { JournalEntryItemActionsDrawer } from "./JournalEntryItemActionsDrawer";


type JournalEntryItemProps = {
  journalEntry: JournalEntry
}
export function JournalEntryItem({ journalEntry }: JournalEntryItemProps) {
  // const [open, setOpen] = useState(false) // open={open} onOpenChange={setOpen}

  const portion = journalEntry.portionName
    // not base portion
    ? `${journalEntry.portionAmount}x '${journalEntry.portionName}'`
    // base portion
    : `${journalEntry.portionAmount * BASE_PORTION_GRAMS} g`

  return (
    <Collapsible>
      <Item variant="muted" size="xs" className="gap-y-0">

        {/* main item */}
        <CollapsibleTrigger className="flex-1">
          <ItemContent className="items-start">
            <ItemTitle className="text-wrap">
              {journalEntry.name}

            </ItemTitle>
            <ItemDescription>
              {journalEntry.kcal} kcal, {portion}
            </ItemDescription>
          </ItemContent>
        </CollapsibleTrigger>

        <ItemActions>
          <JournalEntryItemActions
            journalEntryId={journalEntry.id}
            currentIntakeTime={journalEntry.intakeTime}
          />
          {/* <JournalEntryItemActionsDrawer
            journalEntryId={journalEntry.id}
            currentIntakeTime={journalEntry.intakeTime}
            label={journalEntry.name}
          /> */}
        </ItemActions>

        {/* item footer */}
        <CollapsibleContent className="w-full">
          <ItemFooter className="flex-col items-start gap-1 pt-2">
            <div className="flex justify-between items-center w-full">
              <span>Fette: {journalEntry.fats} g</span>
              <span>Kohlenhydrate: {journalEntry.carbs} g</span>
              <span>Proteine: {journalEntry.proteins} g</span>
            </div>
            {journalEntry.brand && <span className="text-muted-foreground">Marke: ({journalEntry.brand})</span>}
          </ItemFooter>
        </CollapsibleContent>

      </Item>
    </Collapsible>

  );
}
