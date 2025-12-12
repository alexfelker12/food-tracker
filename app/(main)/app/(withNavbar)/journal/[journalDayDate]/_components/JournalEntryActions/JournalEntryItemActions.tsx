"use client"

import { useRef } from "react";

import { DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

import { JournalEntryItemActionDelete } from "./JournalEntryItemActionDelete";
import { JournalEntryItemActionMove } from "./JournalEntryItemActionMove";
import { JournalEntryItemActionRetrack } from "./JournalEntryItemActionRetrack";
import { JournalEntryItemActionUpdate } from "./JournalEntryItemActionUpdate";


interface JournalEntryItemActionsProps {
  label?: string
}
export function JournalEntryItemActions({ label }: JournalEntryItemActionsProps) {
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  return (
    //? "vaul" by Emil Kowalski (library used by shadcn's drawer) doesn't move focus automatically
    // -> manually moving focus
    <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
      {/* label */}
      <DrawerHeader>
        <DrawerTitle className="text-lg">{label || "Optionen"}</DrawerTitle>
        <DrawerDescription className="sr-only">Bearbeite, lösche oder tracke diesen Eintrag erneut</DrawerDescription>
      </DrawerHeader>

      {/* retrack | move | edit */}
      <div className="flex flex-col gap-2 p-4 pt-0">
        {/* retrack */}
        <JournalEntryItemActionRetrack ref={firstButtonRef} />

        {/* move */}
        <JournalEntryItemActionMove />

        {/* edit */}
        <JournalEntryItemActionUpdate />
      </div>

      <div className="px-4 w-full"><Separator /></div>

      {/* delete */}
      <DrawerFooter>
        {/* delete */}
        <JournalEntryItemActionDelete />
      </DrawerFooter>
    </DrawerContent>
  );
}
