"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { isDefinedError } from "@orpc/client"
import { useMutation } from "@tanstack/react-query"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { IntakeTimeEnum, journalEntrySchema } from "@/schemas/journal/journalEntrySchema"
import { intakeTimeLabels } from "@/schemas/labels/journalEntrySchemaLabels"
import { getFoodById } from "@/server/actions/food"

import { IntakeTime } from "@/generated/prisma/enums"

import { useIntakeTimeParam } from "@/hooks/useIntakeTimeParam"

import { APP_BASE_URL, BASE_PORTION_NAME } from "@/lib/constants"
import { orpc } from "@/lib/orpc"
import { getGermanDate, offsetDate } from "@/lib/utils"

import { NotebookTextIcon, PlusIcon, XIcon } from "lucide-react"

import { EnumField } from "@/components/form-fields/EnumField"
import { NumFieldInput } from "@/components/form-fields/NumField"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
// import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

import { FoodMacros } from "./FoodMacros"
import { useRefererUrl } from "@/components/RefererContext"
import { TrackingWeekDays } from "./TrackingWeekDays"


const compProps = journalEntrySchema.pick({ consumableType: true })
export type FoodTrackFormProps = React.ComponentProps<"form">
  & { consumable: NonNullable<Awaited<ReturnType<typeof getFoodById>>> }
  & z.infer<typeof compProps>
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

      const successToast = toast.success(title, {
        description,
        action:
          <Button variant="outline" className="ml-auto" onClick={() => toast.dismiss(successToast)} asChild>
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
            <FoodMacros
              consumable={consumable}
            />
          </div>

          <FieldSeparator />

          <Controller name="intakeTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <EnumField
                field={field}
                fieldState={fieldState}
                label="Mahlzeit"
                description="Wähle die Essenszeit aus"
                placeholder="Mahlzeit"
                compact
                options={IntakeTimeEnum.options}
                labels={intakeTimeLabels}
              />
            )}
          />

          <FieldSeparator />

          <Controller name="portionAmount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="gap-1.5"
                orientation="vertical"
              >
                <div className="flex gap-1.5">
                  <FieldContent className="justify-center gap-1">
                    <FieldLabel htmlFor={field.name}>Portion</FieldLabel>
                    <FieldDescription className="sr-only">Gebe die Anzahl der Portionen an</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                  <ButtonGroup>
                    <InputGroup>
                      <NumFieldInput
                        field={field}
                        fieldState={fieldState}
                        placeholder={"Anzahl" as `${number}`}
                        className="placeholder:text-sm"
                      />
                      <InputGroupAddon align="inline-end">
                        <XIcon className="text-muted-foreground size-3" />
                      </InputGroupAddon>
                    </InputGroup>
                    <Controller name="portionId"
                      control={form.control}
                      render={({ field: nestedField, fieldState: nestedFieldState }) => (
                        <Select
                          name={nestedField.name}
                          value={nestedField.value ?? ""}
                          onValueChange={(value) => {
                            nestedField.onChange(value)
                            nestedField.onBlur() // trigger onBlur at onChange event (level): onBlur on SelectTrigger triggers validation before selection because of focus change into select options
                          }}
                        >
                          <SelectTrigger
                            id={nestedField.name}
                            aria-invalid={nestedFieldState.invalid}
                            className="gap-1 aria-[invalid=false]:text-foreground"
                          >
                            <SelectValue placeholder="Portion wählen" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {consumable.portions.map((portion) => (
                              <SelectItem key={portion.id} value={portion.id}>
                                {portion.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </ButtonGroup>
                </div>
              </Field>
            )}
          />

          <FieldSeparator />

          <Controller name="daysToTrack"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
              >
                <FieldContent className="gap-1">
                  <FieldLabel htmlFor={field.name}>Für mehrere Tage tracken</FieldLabel>
                  <FieldDescription className="sr-only">Tracke heute und bis zu den nächsten 6 Tagen</FieldDescription>
                </FieldContent>

                <TrackingWeekDays
                  field={field}
                  fieldState={fieldState}
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

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
    // <Drawer>
    //   <DrawerTrigger>Open</DrawerTrigger>
    //   <DrawerContent>
    //     <DrawerHeader>
    //       <DrawerTitle>Are you absolutely sure?</DrawerTitle>
    //       <DrawerDescription>This action cannot be undone.</DrawerDescription>
    //     </DrawerHeader>
    //     <DrawerFooter>
    //       <Button>{isPending ? <Spinner /> : <PlusIcon />} Tracken</Button>
    //       <DrawerClose asChild>
    //         <Button variant="outline">Abbrechen</Button>
    //       </DrawerClose>
    //     </DrawerFooter>
    //   </DrawerContent>
    // </Drawer>
  );
}