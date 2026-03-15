"use client"

import { getGermanTime } from "@/lib/utils";

import { PlusIcon } from "lucide-react";

import { ButtonGroup } from "@/components/ui/button-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";

import { WaterEntryActionDelete } from "./WaterEntryActionDelete";
import { WaterEntryActionEdit } from "./WaterEntryActionEdit";
import { useWaterEntry } from "./WaterEntryProvider";


export function WaterEntryItem() {
  const { waterJournalEntry } = useWaterEntry()
  const { createdAt, waterEntry: { amountMl } } = waterJournalEntry

  const entryTimestamp = getGermanTime(createdAt)

  return (
    <Item variant="outline" size="xs">
      <ItemContent>
        <ItemTitle>
          <span className="flex items-center gap-0.5"><PlusIcon className="size-3" /> {amountMl} ml</span>
        </ItemTitle>
        <ItemDescription>{entryTimestamp}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <ButtonGroup>
          <WaterEntryActionEdit />
          <WaterEntryActionDelete />
        </ButtonGroup>
      </ItemActions>
    </Item>
  );
}
