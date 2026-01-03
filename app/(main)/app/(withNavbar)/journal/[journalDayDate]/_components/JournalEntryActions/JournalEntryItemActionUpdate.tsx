"use client"

import { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation, useMutationState, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateJournalEntrySchema } from "@/schemas/journal/updateJournalEntrySchema";

import { orpc } from "@/lib/orpc";

import { CheckIcon, ListXIcon, PencilIcon, XIcon } from "lucide-react";

import { FoodPortionAmount } from "@/components/track/FoodTrackPortionAmount";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import { useJournalEntry } from "./JournalEntryContext";
import { JournalEntryItemActionDelete } from "./JournalEntryItemActionDelete";
import { FoodMacros } from "@/components/track/FoodTrackMacros";


interface JournalEntryItemActionUpdateProps extends React.ComponentPropsWithRef<typeof DrawerTrigger> { }
export function JournalEntryItemActionUpdate({ ref }: JournalEntryItemActionUpdateProps) {
  const { journalEntry, anyActionPending } = useJournalEntry()
  const firstButtonRef = useRef<HTMLButtonElement>(null)

  const journalEntryUpdateState = useMutationState({
    filters: { mutationKey: orpc.food.create.mutationKey() },
    select: (mutation) => mutation.state.status === "pending"
  })
  const isPending = journalEntryUpdateState.length > 0 ? journalEntryUpdateState[journalEntryUpdateState.length - 1] : false

  const FirstButton = <DrawerClose ref={firstButtonRef} asChild>
    <Button variant="outline" className="flex-1"><XIcon /> Abbrechen</Button>
  </DrawerClose>

  return (
    <NestedDrawer>
      <DrawerTrigger className="flex-1" ref={ref} disabled={isPending || anyActionPending} asChild>
        <Button variant="outline">
          {isPending ? <Spinner /> : <PencilIcon />} Bearbeiten
        </Button>
      </DrawerTrigger>
      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
        <DrawerHeader>
          <DrawerTitle className="text-lg">Eintrag bearbeiten</DrawerTitle>
          <DrawerDescription className="sr-only">Bearbeite die gewählte Portion und dessen Menge</DrawerDescription>
        </DrawerHeader>

        {journalEntry.consumableReference?.food
          ? <UpdateJournalEntryForm>
            <DrawerFooter className="flex-col-reverse">
              {FirstButton}
              <DrawerClose asChild>
                <Button type="submit" className="flex-1"><CheckIcon /> Bestätigen</Button>
              </DrawerClose>
            </DrawerFooter>
          </UpdateJournalEntryForm>
          : <div className="flex flex-col gap-2 p-4 pt-0 w-full">
            <JournalEntryFormEmpty />
            {FirstButton}
          </div>
        }
      </DrawerContent>
    </NestedDrawer>
  );
}

interface UpdateJournalEntryFormProps extends React.ComponentProps<"form"> { }
function UpdateJournalEntryForm({ children, ...props }: UpdateJournalEntryFormProps) {
  const { journalEntry, closeMainDrawer } = useJournalEntry()

  //* update mutation
  const qc = useQueryClient()
  const { mutate: handleEdit } = useMutation(orpc.journal.entry.food.update.mutationOptions({
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Es gab Probleme beim bearbeiten des Eintrags. Versuche es nochmal!")
      }
    },
    // onSuccess parameters: (data, variables, onMutateResult, context)
    onSuccess: ({ name }) => {
      qc.invalidateQueries({ queryKey: [["journal", "day"]] })
      toast.success(`${name} wurde erfolgreich bearbeitet`)
      closeMainDrawer()
    }
  }))

  //* update form
  const form = useForm({
    resolver: zodResolver(updateJournalEntrySchema),
    defaultValues: {
      portionId: journalEntry.consumableReference?.foodPortionId!,
      portionAmount: journalEntry.portionAmount,
    },
    mode: "onTouched",
  })

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          handleEdit({
            journalEntryId: journalEntry.id,
            updateSchema: { ...values }
          })
        })}
        // onSubmit={form.handleSubmit((values) => console.log(values))}
        {...props}
      >
        {/* form fields here */}
        {journalEntry.consumableReference?.food &&
          <div className="space-y-4 p-4 pt-0 w-full">
            {/* <Separator />
            <div>
              <h2 className="font-semibold">{journalEntry.consumableReference.food.name}</h2>
              {journalEntry.consumableReference.food.brand && <p className="text-muted-foreground text-sm">{journalEntry.consumableReference.food.brand}</p>}
            </div> */}
            <Separator />
            <FoodMacros consumable={journalEntry.consumableReference.food} />
            <Separator />
            <FoodPortionAmount consumable={journalEntry.consumableReference.food} />
          </div>
        }
        <div className="px-4 w-full"><Separator /></div>
        {children}
      </form>
    </FormProvider>
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
