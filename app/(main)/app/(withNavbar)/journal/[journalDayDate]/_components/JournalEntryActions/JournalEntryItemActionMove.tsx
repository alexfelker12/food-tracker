"use client"

import { useRef } from "react";

import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { intakeTimeLabels } from "@/schemas/labels/journalEntrySchemaLabels";

import { orpc } from "@/lib/orpc";

import { type IntakeTime } from "@/generated/prisma/client";
import { IntakeTime as intakeTimeEnum } from "@/generated/prisma/enums";

import { ArrowDownUpIcon, CheckIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import { useJournalEntry } from "./JournalEntryContext";


interface JournalEntryItemActionMoveProps extends React.ComponentPropsWithRef<typeof DrawerTrigger> { }
export function JournalEntryItemActionMove({ ref }: JournalEntryItemActionMoveProps) {
  const { journalEntry, anyActionPending, closeMainDrawer } = useJournalEntry()
  const firstButtonRef = useRef<HTMLButtonElement>(null)

  const qc = useQueryClient()

  const { mutate, isPending } = useMutation(orpc.journal.entry.move.mutationOptions({
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Es gab Probleme beim verschieben. Versuche es nochmal!")
      }
    },
    // onSuccess parameters: (data, variables, onMutateResult, context)
    onSuccess: ({ name, intakeTime }) => {
      const intakeTimeLabel = intakeTimeLabels[intakeTime]
      const toastMsg = (
        <span className="text-muted-foreground *:[span]:text-foreground">
          <span>{name}</span> wurde nach <span>{intakeTimeLabel}</span> verschoben
        </span>
      )

      // * invalidate journal entries query, notify user and close entry actions drawer
      qc.invalidateQueries({ queryKey: [["journal", "day", "getEntries"]] })
      toast.success(toastMsg)
      closeMainDrawer()
    }
  }))

  const currentIntakeTime = journalEntry.intakeTime

  const handleMove = (intakeTime: IntakeTime) => {
    if (currentIntakeTime === intakeTime) return;
    mutate({
      journalEntryId: journalEntry.id,
      newIntakeTime: intakeTime
    })
  }

  return (
    <NestedDrawer>
      <DrawerTrigger className="flex-1" ref={ref} disabled={isPending || anyActionPending} asChild>
        <Button variant="outline">
          {isPending ? <Spinner /> : <ArrowDownUpIcon />} Verschieben
        </Button>
      </DrawerTrigger>
      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
        <DrawerHeader>
          <DrawerTitle className="text-lg">Verschieben nach...</DrawerTitle>
          <DrawerDescription className="text-base">Wähle eine Tageszeit, zu der dieser Eintrag verschoben werden soll</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-2 p-4 pt-0">
          <MoveOption
            label="Frühstück"
            onOptionSelect={() => handleMove(intakeTimeEnum.BREAKFAST)}
            isActive={currentIntakeTime === intakeTimeEnum.BREAKFAST}
            ref={currentIntakeTime !== intakeTimeEnum.BREAKFAST ? firstButtonRef : undefined}
          />
          <MoveOption
            label="Mittagessen"
            onOptionSelect={() => handleMove(intakeTimeEnum.LUNCH)}
            isActive={currentIntakeTime === intakeTimeEnum.LUNCH}
            ref={currentIntakeTime === intakeTimeEnum.BREAKFAST ? firstButtonRef : undefined}
          />
          <MoveOption
            label="Abendessen"
            onOptionSelect={() => handleMove(intakeTimeEnum.DINNER)}
            isActive={currentIntakeTime === intakeTimeEnum.DINNER}
          />
          <MoveOption
            label="Snacks"
            onOptionSelect={() => handleMove(intakeTimeEnum.SNACKS)}
            isActive={currentIntakeTime === intakeTimeEnum.SNACKS}
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


interface MoveOptionProps extends React.ComponentPropsWithRef<typeof Button> {
  onOptionSelect: () => void
  label: string
  isActive?: boolean
}
function MoveOption({ onOptionSelect, label, isActive, ...props }: MoveOptionProps) {
  return (
    <DrawerClose asChild>
      <Button
        variant={isActive ? "secondary" : "outline"}
        disabled={isActive}
        onClick={() => {
          if (isActive) return;
          onOptionSelect()
        }}
        {...props}
      >
        {isActive && <CheckIcon />} {label}
      </Button>
    </DrawerClose>
  )
}
