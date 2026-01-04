"use client"

import { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation, useMutationState, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { retrackJournalEntrySchema } from "@/schemas/journal/journalEntrySchema";
import { intakeTimeLabels } from "@/schemas/labels/journalEntrySchemaLabels";

import { orpc } from "@/lib/orpc";

import { CheckIcon, CopyCheckIcon, ListXIcon, XIcon } from "lucide-react";

import { FoodTrackIntakeTime } from "@/components/track/components/FoodTrackIntakeTime";
import { FoodTrackMacros } from "@/components/track/components/FoodTrackMacros";
import { FoodTrackPortionAmount } from "@/components/track/components/FoodTrackPortionAmount";
import { FoodTrack } from "@/components/track/FoodTrack";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import { useJournalEntry } from "./JournalEntryContext";


interface JournalEntryItemActionRetrackProps extends React.ComponentPropsWithRef<typeof DrawerTrigger> { }
export function JournalEntryItemActionRetrack({ ref }: JournalEntryItemActionRetrackProps) {
  const { anyActionPending } = useJournalEntry()
  const firstButtonRef = useRef<HTMLButtonElement>(null)

  const journalEntryRetrackState = useMutationState({
    filters: { mutationKey: orpc.journal.entry.retrack.mutationKey() },
    select: (mutation) => mutation.state.status === "pending"
  })
  const isPending = journalEntryRetrackState.length > 0
    ? journalEntryRetrackState[journalEntryRetrackState.length - 1]
    : false

  return (
    <NestedDrawer>
      <DrawerTrigger className="flex-1" ref={ref} disabled={isPending || anyActionPending} asChild>
        <Button variant="outline" >
          {isPending ? <Spinner /> : <CopyCheckIcon />} Erneut tracken
        </Button>
      </DrawerTrigger>
      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
        <DrawerHeader>
          <DrawerTitle className="text-lg">Erneut tracken</DrawerTitle>
          <DrawerDescription className="sr-only">Tracke diesen Eintrag unter Auswahl der Essenszeit und Portion erneut</DrawerDescription>
        </DrawerHeader>

        <RetrackFormWrap />

        <DrawerFooter className="flex-col-reverse pt-2">
          <DrawerClose ref={firstButtonRef} asChild>
            <Button variant="outline" className="flex-1"><XIcon /> Abbrechen</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </NestedDrawer>
  );
}

function RetrackFormWrap() {
  const { journalEntry } = useJournalEntry()

  if (!journalEntry.consumableReference?.food) return <div className="flex flex-col gap-2 p-4 pt-0 w-full">
    <JournalEntryFormEmpty />
  </div>

  return (
    <RetrackJournalEntryForm>
      <DrawerClose asChild>
        <Button type="submit" className="flex-1"><CheckIcon /> Bestätigen</Button>
      </DrawerClose>
    </RetrackJournalEntryForm>
  );
}

function RetrackJournalEntryForm({ children }: { children: React.ReactNode }) {
  const { journalEntry, closeMainDrawer } = useJournalEntry()

  //* Retrack mutation
  const qc = useQueryClient()
  const { mutate: handleRetrack, isPending } = useMutation(orpc.journal.entry.retrack.mutationOptions({
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Es gab Probleme beim erneut tracken. Versuche es nochmal!")
      }
    },
    // onSuccess parameters: (data, variables, onMutateResult, context)
    onSuccess: ({ name, intakeTime }) => {
      const intakeTimeLabel = intakeTimeLabels[intakeTime]
      const toastMsg = (
        <span className="text-muted-foreground *:[span]:text-foreground">
          <span>{name}</span> wurde für <span>{intakeTimeLabel}</span> erneut getrackt
        </span>
      )

      // * invalidate journal entries query, notify user and close entry actions drawer
      qc.invalidateQueries({ queryKey: [["journal", "day"]] })
      toast.success(toastMsg)
      closeMainDrawer()
    }
  }))

  //* Retrack form
  const form = useForm({
    resolver: zodResolver(retrackJournalEntrySchema),
    defaultValues: {
      portionId: journalEntry.consumableReference?.foodPortionId!,
      portionAmount: journalEntry.portionAmount,
    },
    mode: "onTouched",
  })

  return (
    <FoodTrack
      form={form}
      consumable={journalEntry.consumableReference?.food!}
      isPending={isPending}
      onSubmitCallback={(values) => {
        handleRetrack({
          journalEntryId: journalEntry.id,
          retrackSchema: { ...values }
        })
      }}
      className="px-4"
    >
      {/* form fields here */}
      {journalEntry.consumableReference?.food &&
        <div className="space-y-4">
          <Separator />

          <FoodTrackMacros />

          <Separator />

          <FoodTrackIntakeTime />

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
  // const nestedDrawerButtonRef = useRef<HTMLButtonElement>(null)
  return (
    <Empty className="border" {...props}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ListXIcon />
        </EmptyMedia>
        <EmptyTitle>Eintrag kann nicht erneut getrackt werden</EmptyTitle>
        <EmptyDescription>
          Lebensmittel oder Mahlzeit konnte nicht gefunden werden
        </EmptyDescription>
      </EmptyHeader>
      {/* <EmptyContent>
        <JournalEntryItemActionDelete buttonText="Eintrag löschen" ref={nestedDrawerButtonRef} />
      </EmptyContent> */}
    </Empty>
  );
}
