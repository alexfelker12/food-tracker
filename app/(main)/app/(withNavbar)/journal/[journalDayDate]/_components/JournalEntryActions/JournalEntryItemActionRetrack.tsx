"use client"

import { useRef } from "react";

// import { isDefinedError } from "@orpc/client";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";

// import { orpc } from "@/lib/orpc";

import { type IntakeTime } from "@/generated/prisma/client";
import { IntakeTime as intakeTimeEnum } from "@/generated/prisma/enums";

import { CopyCheckIcon, XIcon } from "lucide-react";

import { IntakeTimeOption } from "@/components/journal/IntakeTimeOption";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import { useJournalEntry } from "./JournalEntryContext";


interface JournalEntryItemActionRetrackProps extends React.ComponentPropsWithRef<typeof DrawerTrigger> { }
export function JournalEntryItemActionRetrack({ ref }: JournalEntryItemActionRetrackProps) {
  const { journalEntry, anyActionPending } = useJournalEntry()
  const firstButtonRef = useRef<HTMLButtonElement>(null)

  const handleRetracking = (intakeTime: IntakeTime) => console.log("retracking", journalEntry.id, "for:", intakeTime)
  const isPending = false

  // const qc = useQueryClient()

  // const { mutate: handleRetracking, isPending } = useMutation(orpc.journal.entry.delete.mutationOptions({
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
        <Button variant="outline" >
          {isPending ? <Spinner /> : <CopyCheckIcon />} Erneut tracken
        </Button>
      </DrawerTrigger>
      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
        <DrawerHeader>
          <DrawerTitle className="text-lg">Erneut tracken für...</DrawerTitle>
          <DrawerDescription className="text-base">Wähle eine Tageszeit, zu der dieser Eintrag für heute erneut getrackt werden soll</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-2 p-4 pt-0">
          <IntakeTimeOption
            label="Frühstück"
            onOptionSelect={() => handleRetracking(intakeTimeEnum.BREAKFAST)}
            ref={firstButtonRef}
          />
          <IntakeTimeOption
            label="Mittagessen"
            onOptionSelect={() => handleRetracking(intakeTimeEnum.LUNCH)}
          />
          <IntakeTimeOption
            label="Abendessen"
            onOptionSelect={() => handleRetracking(intakeTimeEnum.DINNER)}
          />
          <IntakeTimeOption
            label="Snacks"
            onOptionSelect={() => handleRetracking(intakeTimeEnum.SNACKS)}
          />
        </div>

        <div className="px-4 w-full"><Separator /></div>

        <DrawerFooter className="flex-col-reverse">
          <DrawerClose ref={firstButtonRef} asChild>
            <Button variant="outline" className="flex-1"><XIcon /> Abbrechen</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </NestedDrawer>
  );
}
