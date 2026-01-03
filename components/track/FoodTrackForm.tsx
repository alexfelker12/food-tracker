"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { isDefinedError } from "@orpc/client"
import { useMutation } from "@tanstack/react-query"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { FoodWithPortionsType } from "@/orpc/router/food/list"
import { journalEntrySchema } from "@/schemas/journal/journalEntrySchema"
import { intakeTimeLabels } from "@/schemas/labels/journalEntrySchemaLabels"

import { IntakeTime } from "@/generated/prisma/enums"

import { useIntakeTimeParam } from "@/hooks/useIntakeTimeParam"

import { APP_BASE_URL, BASE_PORTION_NAME } from "@/lib/constants"
import { orpc } from "@/lib/orpc"
import { getGermanDate, offsetDate } from "@/lib/utils"

import { NotebookTextIcon, PlusIcon } from "lucide-react"

import { useRefererUrl } from "@/components/RefererContext"
import { Button } from "@/components/ui/button"
import { FieldGroup, FieldSeparator } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

import { FoodTrackDays } from "./FoodTrackDays"
import { FoodTrackIntakeTime } from "./FoodTrackIntakeTime"
import { FoodMacros } from "./FoodTrackMacros"
import { FoodPortionAmount } from "./FoodTrackPortionAmount"


const compProps = journalEntrySchema.pick({ consumableType: true })
export interface FoodTrackFormProps extends
  React.ComponentProps<"form">,
  z.infer<typeof compProps> {
  consumable: FoodWithPortionsType
}
export function FoodTrackForm({ consumable, consumableType, children, ...props }: FoodTrackFormProps) {
  const { intakeTime } = useIntakeTimeParam()
  const { refererUrl } = useRefererUrl()
  const { back, push } = useRouter()

  // referer
  const foodListingUrl = APP_BASE_URL + "/track/food"
  const fromFoodListing = refererUrl && refererUrl.pathname === foodListingUrl

  // initial portion
  const defaultPortion = consumable.portions.find((portion) => portion.isDefault)
  const initialPortion = defaultPortion ?? consumable.portions.find((portion) => portion.name === BASE_PORTION_NAME)!

  const today = offsetDate(new Date())

  //* main form
  const form = useForm({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      consumableId: consumable?.id,
      consumableType,
      daysToTrack: [today],
      portionId: initialPortion.id,
      portionAmount: 1,
      intakeTime: intakeTime as IntakeTime
    },
    mode: "onTouched",
  })

  //* create food mutation
  const { mutate: trackConsumable, isPending } = useMutation(orpc.journal.track.mutationOptions({
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Es gab Probleme beim tracken. Versuche es nochmal!")
      }
    },
    // onSuccess parameters: (data, variables, onMutateResult, context)
    onSuccess: ({ count }, variables) => {
      form.reset()

      // default multiple days
      const title = `${consumable.name} wurde getrackt`
      let description = <span>Zu {count} Tagen hinzugefügt</span>

      if (count === 1) {
        // single day was tracked - add more details
        const dateString = getGermanDate(variables.daysToTrack[0])

        description = <span className="text-muted-foreground">
          Für den {" "}
          <span className="text-foreground">{dateString}</span> zu {" "}
          <span className="text-foreground">{intakeTimeLabels[variables.intakeTime]}</span> {" "}
          hinzugefügt
        </span>
      }

      toast.success(title, {
        description,
        action:
          <Button variant="outline" className="ml-auto" onClick={() => toast.dismiss()} asChild>
            <Link href={APP_BASE_URL + "/journal/today"}><NotebookTextIcon /> Tagebuch</Link>
          </Button>
        ,
        // cancel: {
        //   label: <><NotebookTextIcon /> Tagebuch</>,
        //   onClick: () => push(APP_BASE_URL + "/journal/today")
        // }, 
        duration: 1000 * 60 // * n sec
      })

      // navigate back to foodlisting
      if (fromFoodListing) {
        back() // if coming from food listing just go back in browser history
      } else {
        push(foodListingUrl) // else just navigate directly to that route
      }
    }
  }))

  return (
    <FormProvider {...form}>
      <form
        className=""
        onSubmit={form.handleSubmit((values) => trackConsumable(values))}
        // onSubmit={form.handleSubmit((values) => console.log(values))}
        {...props}
      >
        <FieldGroup className="gap-4">

          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Makronährwerte der ausgewählten Portionsmenge:</p>
            <FoodMacros consumable={consumable} />
          </div>

          <FieldSeparator />

          <FoodTrackIntakeTime />

          <FieldSeparator />

          <FoodPortionAmount consumable={consumable} />

          <FieldSeparator />

          <FoodTrackDays />

          <FieldSeparator />

          <div className="flex justify-end">
            <Button
              disabled={isPending}
            >
              {isPending ? <Spinner /> : <PlusIcon />} Tracken
            </Button>
          </div>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}