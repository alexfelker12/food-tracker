"use client"

import { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation, useMutationState, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateJournalEntrySchema } from "@/schemas/journal/journalEntrySchema";

import { orpc } from "@/lib/orpc";

import { CheckIcon, ListXIcon, PencilIcon, XIcon } from "lucide-react";

import { FoodTrackMacros } from "@/components/track/components/FoodTrackMacros";
import { FoodTrackPortionAmount } from "@/components/track/components/FoodTrackPortionAmount";
import { FoodTrack } from "@/components/track/FoodTrack";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import { useJournalEntry } from "./JournalEntryContext";
import { JournalEntryItemActionDelete } from "./JournalEntryItemActionDelete";


interface JournalEntryItemActionUpdateProps extends React.ComponentPropsWithRef<typeof DrawerTrigger> { }
export function JournalEntryItemActionUpdate({ ref }: JournalEntryItemActionUpdateProps) {
  const { journalEntry, anyActionPending } = useJournalEntry()
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const drawerCloseRef = useRef<HTMLButtonElement>(null)

  const closeNestedDrawer = () => drawerCloseRef.current?.click()

  const journalEntryUpdateState = useMutationState({
    filters: { mutationKey: orpc.journal.entry.food.update.mutationKey() },
    select: (mutation) => mutation.state.status === "pending"
  })
  const isPending = journalEntryUpdateState.length > 0
    ? journalEntryUpdateState[journalEntryUpdateState.length - 1]
    : false

  return (
    <NestedDrawer>
      <DrawerTrigger className="flex-1" ref={ref} disabled={isPending || anyActionPending} asChild>
        <Button variant="outline">
          {isPending ? <Spinner /> : <PencilIcon />} Bearbeiten
        </Button>
      </DrawerTrigger>
      <DrawerClose ref={drawerCloseRef} className="hidden!" aria-hidden={true} />
      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
        <DrawerHeader>
          <DrawerTitle className="text-lg">Eintrag bearbeiten</DrawerTitle>
          <DrawerDescription className="sr-only">Bearbeite die gewählte Portion und dessen Menge</DrawerDescription>
        </DrawerHeader>

        {journalEntry.foodEntry?.food
          ?
          <UpdateJournalEntryForm onMutate={closeNestedDrawer}>
            <Button type="submit" className="flex-1"><CheckIcon /> Bestätigen</Button>
          </UpdateJournalEntryForm>
          :
          <div className="flex flex-col gap-2 p-4 pt-0 w-full">
            <JournalEntryFormEmpty />
          </div>
        }

        <DrawerFooter className="flex-col-reverse pt-2">
          <Button variant="outline" className="flex-1" ref={firstButtonRef} onClick={closeNestedDrawer}>
            <XIcon /> Abbrechen
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </NestedDrawer>
  );
}

function UpdateJournalEntryForm({
  onMutate = () => { },
  children
}: {
  onMutate?: () => void
  children: React.ReactNode
}) {
  const { journalEntry, closeMainDrawer } = useJournalEntry()

  //* update mutation
  const qc = useQueryClient()
  const { mutate: handleEdit, isPending } = useMutation(orpc.journal.entry.food.update.mutationOptions({
    onMutate,
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Es gab Probleme beim bearbeiten des Eintrags. Versuche es nochmal!")
      }
    },
    // onSuccess parameters: (data, variables, onMutateResult, context)
    onSuccess: () => {
      const toastMsg = (
        <span className="text-muted-foreground *:[span]:text-foreground">
          Eintrag wurde erfolgreich bearbeitet
        </span>
      )

      qc.invalidateQueries({ queryKey: [["journal", "day"]] })
      toast.success(toastMsg)
      closeMainDrawer()
    }
  }))

  //* update form
  const form = useForm({
    resolver: zodResolver(updateJournalEntrySchema),
    defaultValues: {
      portionId: journalEntry.foodEntry?.foodPortionId!,
      portionAmount: journalEntry.foodEntry.portionAmount,
    },
    mode: "onTouched",
  })

  return (
    <FoodTrack
      form={form}
      consumable={journalEntry.foodEntry?.food!}
      isPending={isPending}
      onSubmitCallback={(values) => {
        handleEdit({
          journalEntryId: journalEntry.id,
          updateSchema: { ...values }
        })
      }}
      className="px-4"
    >
      {/* form fields here */}
      {journalEntry.foodEntry?.food &&
        <div className="space-y-4">
          {/* <Separator />
            <div>
              <h2 className="font-semibold">{journalEntry.consumableReference.food.name}</h2>
              {journalEntry.consumableReference.food.brand && <p className="text-muted-foreground text-sm">{journalEntry.consumableReference.food.brand}</p>}
            </div> */}

          <Separator />

          <FoodTrackMacros />

          <Separator />

          <FoodTrackPortionAmount />
        </div>
      }

      <Separator />

      <div className="flex">
        {children}
      </div>
    </FoodTrack>
  );
}

interface JournalEntryFormEmptyProps extends React.ComponentProps<typeof Empty> { }
function JournalEntryFormEmpty({ children, ...props }: JournalEntryFormEmptyProps) {
  const nestedDrawerButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <Empty className="border" {...props}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ListXIcon />
        </EmptyMedia>
        <EmptyTitle>Eintrag kann nicht bearbeitet werden</EmptyTitle>
        <EmptyDescription>
          Lebensmittel oder Mahlzeit konnte nicht gefunden werden
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <JournalEntryItemActionDelete buttonText="Eintrag löschen" ref={nestedDrawerButtonRef} />
      </EmptyContent>
    </Empty>
  );
}
