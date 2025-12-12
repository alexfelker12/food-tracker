"use client"

import { useRef } from "react";

import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { orpc } from "@/lib/orpc";

import { CheckIcon, PencilIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";

import { useJournalEntry } from "./JournalEntryContext";


interface JournalEntryItemActionUpdateProps extends React.ComponentPropsWithRef<typeof DrawerTrigger> { }
export function JournalEntryItemActionUpdate({ ref }: JournalEntryItemActionUpdateProps) {
  const { journalEntry, anyActionPending } = useJournalEntry()
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const handleEdit = () => console.log("editing entry:", journalEntry.id)
  const isPending = false

  // const qc = useQueryClient()

  // const { mutate: handleEdit, isPending } = useMutation(orpc.journal.entry.delete.mutationOptions({
  //   onError: (error) => {
  //     if (isDefinedError(error)) {
  //       toast.error(error.message)
  //     } else {
  //       toast.error("Es gab Probleme beim Löschen")
  //     }
  //   },
  //   // onSuccess parameters: (data, variables, onMutateResult, context)
  //   onSuccess: ({ name }) => {
  //     toast.success(`${name} wurde gelöscht`)
  //     qc.invalidateQueries({
  //       queryKey: [["journal", "day"]]
  //     })
  //   }
  // }))

  return (
    <NestedDrawer>
      <DrawerTrigger className="flex-1" ref={ref} disabled={isPending || anyActionPending} asChild>
        <Button variant="outline">
          {isPending ? <Spinner /> : <PencilIcon />}  Bearbeiten
        </Button>
      </DrawerTrigger>
      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
        <DrawerHeader>
          <DrawerTitle className="text-lg">Eintrag bearbeiten</DrawerTitle>
          <DrawerDescription className="sr-only">Bearbeite die gewählte Portion und dessen Menge</DrawerDescription>
        </DrawerHeader>

        <div className="p-4"> edit form here </div>

        <DrawerFooter className="flex-col-reverse">
          <DrawerClose ref={firstButtonRef} asChild>
            <Button variant="outline" className="flex-1"><XIcon /> Abbrechen</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button className="flex-1"
              onClick={handleEdit}
            // onClick={() => handleEdit({ journalEntryId })}
            ><CheckIcon /> Bestätigen</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </NestedDrawer>
  );
}
