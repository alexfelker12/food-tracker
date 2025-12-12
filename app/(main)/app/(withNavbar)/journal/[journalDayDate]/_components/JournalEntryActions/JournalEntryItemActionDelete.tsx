"use client"

import { useRef } from "react";

import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { orpc } from "@/lib/orpc";

import { Trash2Icon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";

import { useJournalEntry } from "./JournalEntryContext";


interface JournalEntryItemActionDeleteProps extends React.ComponentPropsWithRef<typeof DrawerTrigger> { }
export function JournalEntryItemActionDelete({ ref }: JournalEntryItemActionDeleteProps) {
  const { journalEntry, closeMainDrawer, anyActionPending } = useJournalEntry()
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const qc = useQueryClient()

  const { mutate: handleDelete, isPending } = useMutation(orpc.journal.entry.delete.mutationOptions({
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Es gab Probleme beim Löschen")
      }
    },
    // onSuccess parameters: (data, variables, onMutateResult, context)
    onSuccess: ({ name }) => {
      qc.invalidateQueries({ queryKey: [["journal", "day"]] })
      toast.success(`${name} wurde gelöscht`)
      closeMainDrawer()
    }
  }))

  return (
    <NestedDrawer>
      <DrawerTrigger className="flex-1" ref={ref} disabled={isPending || anyActionPending} asChild>
        <Button variant="destructive">
          {isPending ? <Spinner /> : <Trash2Icon />} Löschen
        </Button>
      </DrawerTrigger>
      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
        <DrawerHeader>
          <DrawerTitle className="text-lg">Bist du dir sicher?</DrawerTitle>
          <DrawerDescription className="text-base">Du kannst diesen Eintrag nicht wiederherstellen</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex-col-reverse">
          <DrawerClose ref={firstButtonRef} asChild>
            <Button variant="outline" className="flex-1"><XIcon /> Abbrechen</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => handleDelete({ journalEntryId: journalEntry.id })}
            ><Trash2Icon /> Bestätigen</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </NestedDrawer>
  );
}
