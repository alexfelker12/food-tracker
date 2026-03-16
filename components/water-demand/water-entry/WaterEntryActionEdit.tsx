"use client"

import { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { waterDemandSchema } from "@/schemas/journal/journalEntrySchema";

import { orpc } from "@/lib/orpc";
import { getGermanDate, getGermanTime } from "@/lib/utils";

import { PencilIcon, SaveIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";

import { AmountInput } from "../AddWaterForm";
import { CurrentWaterGoal } from "../AddWaterFormWrap";
import { useWaterEntry } from "./WaterEntryProvider";


export function WaterEntryActionEdit() {
  const [open, setOpen] = useState(false)
  const { waterJournalEntry, anyActionPending } = useWaterEntry()
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const qc = useQueryClient()

  //* create food mutation
  const { mutate: handleEdit, isPending } = useMutation(orpc.journal.day.water.edit.mutationOptions({
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Es gab Probleme beim bearbeiten. Versuche es nochmal!")
      }
    },
    // onSuccess parameters: (data, variables, onMutateResult, context)
    onSuccess: (data) => {
      form.reset({ amountMl: data.waterEntry.amountMl })
      qc.invalidateQueries({ queryKey: [["journal", "day", "getWaterDemand"]] })
      qc.invalidateQueries({ queryKey: [["journal", "day", "water"]] })
      toast.success("Menge wurde angepasst", { description: `${data.waterEntry.amountMl} ml` })
      setOpen(false)
    }
  }))

  const { id, createdAt, waterEntry: { amountMl } } = waterJournalEntry

  //* main form
  const form = useForm({
    resolver: zodResolver(waterDemandSchema),
    defaultValues: { amountMl },
    mode: "onTouched",
  })

  const formAmountMl = form.watch("amountMl")

  const entryDatetime = getGermanDate(createdAt)
  const entryTimestamp = getGermanTime(createdAt)

  return (
    <NestedDrawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="flex-1" disabled={isPending || anyActionPending} asChild>
        <Button variant="secondary" size="icon-sm">
          {isPending
            ? <Spinner />
            : <><PencilIcon /> <span className="sr-only">Menge bearbeiten</span></>
          }
        </Button>
      </DrawerTrigger>
      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
        <DrawerHeader className="pb-0">
          <DrawerTitle className="text-lg">{entryDatetime} - {entryTimestamp}</DrawerTitle>
          <DrawerDescription className="text-base">Passe die getrackte Menge für diesen Zeitpunkt an</DrawerDescription>
        </DrawerHeader>

        <FormProvider {...form}>
          <form
            className="flex flex-col gap-4 p-4 w-full"
            onSubmit={form.handleSubmit((values) => handleEdit({
              journalEntryId: id,
              waterDemandSchema: values
            }))}
          >
            <AmountInput />

            <DrawerFooter className="flex-col-reverse p-0">
              <DrawerClose ref={firstButtonRef} asChild>
                <Button variant="outline" disabled={isPending}>
                  <XIcon /> Abbrechen
                </Button>
              </DrawerClose>
              <Button disabled={isPending}>
                {isPending ? <Spinner /> : <SaveIcon />} Speichern
              </Button>
            </DrawerFooter>
          </form>
        </FormProvider>
      </DrawerContent>
    </NestedDrawer>
  );
}
