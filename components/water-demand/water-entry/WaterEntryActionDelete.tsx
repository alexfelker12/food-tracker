"use client"

import { useRef, useState } from "react";

import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { orpc } from "@/lib/orpc";
import { getGermanTime } from "@/lib/utils";

import { Trash2Icon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";

import { useWaterEntry } from "./WaterEntryProvider";


export function WaterEntryActionDelete() {
  const [open, setOpen] = useState(false)
  const { waterJournalEntry, anyActionPending } = useWaterEntry()
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const qc = useQueryClient()

  const { mutate: handleDelete, isPending } = useMutation(orpc.journal.day.water.delete.mutationOptions({
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Es gab Probleme beim Löschen")
      }
    },
    onMutate: () => setOpen(false),
    // onSuccess parameters: (data, variables, onMutateResult, context)
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [["journal", "day", "getWaterDemand"]] })
      qc.invalidateQueries({ queryKey: [["journal", "day", "water"]] })
      toast.success("Eintrag wurde gelöscht")
    }
  }))

  const { createdAt, waterEntry: { amountMl } } = waterJournalEntry

  const entryTimestamp = getGermanTime(createdAt)

  return (
    <NestedDrawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="flex-1" disabled={isPending || anyActionPending} asChild>
        <Button variant="destructive" size="icon-sm">
          {isPending
            ? <Spinner />
            : <><Trash2Icon /> <span className="sr-only">Eintrag löschen</span></>
          }
        </Button>
      </DrawerTrigger>
      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
        <DrawerHeader>
          <DrawerTitle className="text-lg">{amountMl} ml ({entryTimestamp}) löschen?</DrawerTitle>
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
              onClick={() => handleDelete({ journalEntryId: waterJournalEntry.id })}
            ><Trash2Icon /> Bestätigen</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </NestedDrawer>
  );
}
