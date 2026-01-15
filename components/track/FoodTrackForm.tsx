"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { isDefinedError } from "@orpc/client"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
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

import { NotebookTextIcon } from "lucide-react"

import { useRefererUrl } from "@/components/RefererContext"
import { Button } from "@/components/ui/button"
import { FieldGroup, FieldSeparator } from "@/components/ui/field"

import { FoodTrackDays } from "./components/FoodTrackDays"
import { FoodTrackIntakeTime } from "./components/FoodTrackIntakeTime"
import { FoodTrackMacros } from "./components/FoodTrackMacros"
import { FoodTrackPortionAmount } from "./components/FoodTrackPortionAmount"
import { FoodTrackSubmit } from "./components/FoodTrackSubmit"
import { FoodTrack } from "./FoodTrack"
import { useEffect } from "react"


const compProps = journalEntrySchema.pick({ consumableType: true })
export interface FoodTrackFormProps extends
  React.ComponentProps<"form">,
  z.infer<typeof compProps> {
  consumable: FoodWithPortionsType
}
export function FoodTrackForm({ consumable, consumableType }: FoodTrackFormProps) {
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

  const defaultValues: z.infer<typeof journalEntrySchema> = {
    consumableId: consumable?.id,
    consumableType,
    daysToTrack: [today],
    portionId: initialPortion.id,
    portionAmount: 1,
    intakeTime: intakeTime as IntakeTime,
  }

  //* main form
  const form = useForm({
    resolver: zodResolver(journalEntrySchema),
    defaultValues,
    mode: "onTouched",
  })

  //* update form with changing intaketime
  useEffect(() => {
    form.reset(defaultValues)
  }, [intakeTime])

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
    <FoodTrack
      form={form}
      consumable={consumable}
      isPending={isPending}
      onSubmitCallback={trackConsumable}
    >
      <FieldGroup className="gap-4">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">Makronährwerte der ausgewählten Portionsmenge:</p>
          <FoodTrackMacros />
        </div>

        <FieldSeparator />

        <FoodTrackIntakeTime />

        <FieldSeparator />

        <FoodTrackPortionAmount />

        <FieldSeparator />

        <FoodTrackDays />

        <FieldSeparator />

        <div className="flex justify-end">
          <FoodTrackSubmit />
        </div>
      </FieldGroup>
    </FoodTrack>
  );
}