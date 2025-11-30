import { EnumField } from "@/components/form-fields/EnumField"
import { Button } from "@/components/ui/button"
// import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Spinner } from "@/components/ui/spinner"
import { BASE_PORTION_NAME } from "@/lib/constants"
import { orpc } from "@/lib/orpc"
import { IntakeTimeEnum, journalEntrySchema } from "@/schemas/journal/journalEntrySchema"
import { intakeTimeLabels } from "@/schemas/labels/journalEntrySchemaLabels"
import { getFoodById } from "@/server/actions/food"
import { zodResolver } from "@hookform/resolvers/zod"
import { isDefinedError } from "@orpc/client"
import { useMutation } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"



const compProps = journalEntrySchema.pick({ consumableType: true })
type FoodTrackFormProps = React.ComponentProps<"form">
  & { consumable: NonNullable<Awaited<ReturnType<typeof getFoodById>>> }
  & z.infer<typeof compProps>
export function FoodTrackForm({ consumable, consumableType, children, ...props }: FoodTrackFormProps) {
  const defaultPortion = consumable.portions.find((portion) => portion.isDefault)
  const initialPortion = defaultPortion ?? consumable.portions.find((portion) => portion.name === BASE_PORTION_NAME)!

  const testDays = Array.from({ length: 3 }).map((_, index) => {
    const date = new Date()
    const day = date.getDate()
    date.setDate(day + index)
    return date
  })

  //* main form
  const form = useForm<z.infer<typeof journalEntrySchema>>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      consumableId: consumable?.id,
      consumableType,
      daysToTrack: testDays,
      portionId: initialPortion.id,
      portionAmount: 1
    },
    mode: "onTouched",
  })

  const portionData = useWatch({
    name: ["portionId", "portionAmount"],
    control: form.control,
    // compute: (data: { // TODO: check correct type of compute callback parameter
    //   portionId: string
    //   portionAmount: number
    // }) => {

    // }
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
    onSuccess: (data) => {
      form.reset()
      //   form.setValue("portions", [])
      console.log(data)

      toast.success("Essen wurde getrackt", {
        description: "", // TODO: check if multiple were created
      })
    }
  }))

  return (
    <FormProvider {...form}>
      <form
        className="size-full"
        onSubmit={form.handleSubmit((values) => trackConsumable(values))}
        {...props}
      >
        <div className="flex flex-col gap-4 p-4">
          {/* name & brand */}

          {/* <Controller name="food.name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                data-invalid={fieldState.invalid}
                className="gap-1.5"
                >
                <FieldDescription className="sr-only">Handelsüblicher Name des Lebensmittel</FieldDescription>
                <ButtonGroup>
                <ButtonGroupText asChild>
                <FieldLabel htmlFor={field.name} className="justify-center w-16">Name</FieldLabel>
                    </ButtonGroupText>
                    <InputGroup>
                    <InputGroupInput
                    id={field.name}
                    className=""
                    placeholder="Apfel, Banane, ..."
                    aria-invalid={fieldState.invalid}
                    {...field}
                    />
                    </InputGroup>
                    </ButtonGroup>
                    
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                    )}
                    /> */}

          {/* {children || <div className="flex justify-end mt-2">
          <Button
          type="submit"
            disabled={isPending}
          >
            {isPending ? <Spinner /> : <PlusIcon />} Erstellen
            </Button>
            </div>} */}

          <Controller name="intakeTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <EnumField
                field={field}
                fieldState={fieldState}
                label="Mahlzeit"
                description="Wähle die Essenszeit aus"
                placeholder="Mahlzeit"
                options={IntakeTimeEnum.options}
                labels={intakeTimeLabels}
              />
            )}
          />

        </div>
        <Button>{isPending ? <Spinner /> : <PlusIcon />} Tracken</Button>
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