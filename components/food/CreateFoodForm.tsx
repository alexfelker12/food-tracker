"use client"

import { Suspense, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { orpc } from "@/lib/orpc";
import { foodWithPortionsSchema } from "@/schemas/food/foodSchema";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { FoodWithPortionsSchema } from "@/schemas/types";
import { ListPlusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import { APP_BASE_URL } from "@/lib/constants";


export function CreateFoodForm({ className, children, ...props }: React.ComponentProps<"form">) {
  //* main form
  const form = useForm({
    resolver: zodResolver(foodWithPortionsSchema),
    defaultValues: {
      food: {
        name: "",
        brand: "",
      },
      portions: []
    },
    mode: "onTouched",
  })

  //* create food mutation
  const { mutate: createFood, isPending } = useMutation(orpc.food.create.mutationOptions({
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Es gab Probleme beim Erstellen dieses Lebensmittels. Versuche es nochmal!")
      }
    },
    // onSuccess parameters: (data, variables, onMutateResult, context)
    onSuccess: (data) => {
      form.reset()
      form.setValue("portions", [])
      console.log(data)

      toast("Lebensmittel wurde erfolgreich erstellt", {
        description: `${data.name} ${data.brand ? `- ${data.brand}` : ""}`,
        action: (
          <Button asChild variant="secondary">
            <Link href={`${APP_BASE_URL}/track/food/${data.id}`}>
              Zum Lebensmittel
            </Link>
          </Button>
        )
      })
    }
  }))

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-4 size-full"
        onSubmit={form.handleSubmit((values) => createFood(values))}
        // onSubmit={form.handleSubmit((values) => console.log(values))}
        {...props}
      >
        {/* name & brand */}
        <FieldSet>
          <FieldLegend>Bezeichnung</FieldLegend>
          <FieldDescription className="sr-only">
            Gebe die Bezeichnung und Marke des Lebensmittels an
          </FieldDescription>
          <FieldGroup className="gap-2">
            <Controller name="food.name"
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
            />
            <Controller name="food.brand"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="gap-1.5"
                >
                  <FieldDescription className="sr-only">Dies hilft das Lebensmittel beim Tracken einzugrenzen</FieldDescription>
                  <ButtonGroup>
                    <ButtonGroupText asChild>
                      <FieldLabel htmlFor={field.name} className="justify-center w-16">Marke</FieldLabel>
                    </ButtonGroupText>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        className=""
                        placeholder="Edeka, Lidl, ..."
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                    </InputGroup>
                  </ButtonGroup>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Makronährwerte - pro 100 gramm</FieldLegend>
          <FieldDescription className="sr-only">
            Gebe die Gramm Menge für jeden Makronährwert an
          </FieldDescription>
          <FieldGroup className="gap-2">
            <Controller name="food.kcal"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="gap-1.5"
                  orientation="horizontal"
                >
                  <div className="flex flex-col flex-1 gap-0.5">
                    <FieldLabel htmlFor={field.name}>Kalorien</FieldLabel>
                    <FieldDescription className="sr-only">Kalorien des Lebensmittels pro 100 gramm</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </div>
                  <InputGroup className="flex-1">
                    <InputGroupInput
                      id={field.name}
                      className="text-right"
                      aria-invalid={fieldState.invalid}
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={event => {
                        const value = event.target.value
                        const numValue = +value
                        const onChangeValue = value === "" || isNaN(numValue)
                          ? null
                          : +(Math.min(Math.max(numValue, 0), 999).toFixed(2))
                        field.onChange(onChangeValue)
                        if (fieldState.isTouched) field.onBlur() // trigger onBlur at onChange event (level): onBlur triggers validation "onInput"
                      }}
                      onFocus={(e) => e.target.select()}
                    />
                    <InputGroupAddon align="inline-end">kcal / 100g</InputGroupAddon>
                  </InputGroup>
                </Field>
              )}
            />
            <Controller name="food.fats"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="gap-1.5"
                  orientation="horizontal"
                >
                  <div className="flex flex-col flex-1 gap-0.5">
                    <FieldLabel htmlFor={field.name}>Fette</FieldLabel>
                    <FieldDescription className="sr-only">Fettmenge in gramm des Lebensmittels pro 100 gramm</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </div>
                  <InputGroup className="flex-1">
                    <InputGroupInput
                      id={field.name}
                      className="text-right"
                      aria-invalid={fieldState.invalid}
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={event => {
                        const value = event.target.value
                        const numValue = +value
                        const onChangeValue = value === "" || isNaN(numValue)
                          ? null
                          : +(Math.min(Math.max(numValue, 0), 999).toFixed(2))
                        field.onChange(onChangeValue)
                        if (fieldState.isTouched) field.onBlur() // trigger onBlur at onChange event (level): onBlur triggers validation "onInput"
                      }}
                      onFocus={(e) => e.target.select()}
                    />
                    <InputGroupAddon align="inline-end">g / 100g</InputGroupAddon>
                  </InputGroup>
                </Field>
              )}
            />
            <Controller name="food.carbs"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="gap-1.5"
                  orientation="horizontal"
                >
                  <div className="flex flex-col flex-1 gap-0.5">
                    <FieldLabel htmlFor={field.name}>Kohlenhydrate</FieldLabel>
                    <FieldDescription className="sr-only">Kohlenhydratmenge in gramm des Lebensmittels pro 100 gramm</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </div>
                  <InputGroup className="flex-1">
                    <InputGroupInput
                      id={field.name}
                      className="text-right"
                      aria-invalid={fieldState.invalid}
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={event => {
                        const value = event.target.value
                        const numValue = +value
                        const onChangeValue = value === "" || isNaN(numValue)
                          ? null
                          : +(Math.min(Math.max(numValue, 0), 999).toFixed(2))
                        field.onChange(onChangeValue)
                        if (fieldState.isTouched) field.onBlur() // trigger onBlur at onChange event (level): onBlur triggers validation "onInput"
                      }}
                      onFocus={(e) => e.target.select()}
                    />
                    <InputGroupAddon align="inline-end">g / 100g</InputGroupAddon>
                  </InputGroup>
                </Field>
              )}
            />
            <Controller name="food.protein"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="gap-1.5"
                  orientation="horizontal"
                >
                  <div className="flex flex-col flex-1 gap-0.5">
                    <FieldLabel htmlFor={field.name}>Proteine</FieldLabel>
                    <FieldDescription className="sr-only">Proteinmenge des Lebensmittels pro 100 gramm</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </div>
                  <InputGroup className="flex-1">
                    <InputGroupInput
                      id={field.name}
                      className="text-right"
                      aria-invalid={fieldState.invalid}
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={event => {
                        const value = event.target.value
                        const numValue = +value
                        const onChangeValue = value === "" || isNaN(numValue)
                          ? null
                          : +(Math.min(Math.max(numValue, 0), 999).toFixed(2))
                        field.onChange(onChangeValue)
                        if (fieldState.isTouched) field.onBlur() // trigger onBlur at onChange event (level): onBlur triggers validation "onInput"
                      }}
                      onFocus={(e) => e.target.select()}
                    />
                    <InputGroupAddon align="inline-end">g / 100g</InputGroupAddon>
                  </InputGroup>
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        <Suspense>
          <FoodPortions />
        </Suspense>

        <div className="flex justify-end mt-2">
          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending ? <Spinner /> : <PlusIcon />} Erstellen
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

function FoodPortions() {
  const { control, setValue, formState } = useFormContext<FoodWithPortionsSchema>();

  //* portion field array
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "portions",
  })

  const handleDefaultSelect = (selectedIndex: number) => {
    fields.forEach((_, i) => {
      setValue(`portions.${i}.isDefault`, i === selectedIndex, {
        shouldValidate: true,
        shouldDirty: true,
      });
    });
  };

  return (
    <FieldSet className="gap-4">
      <FieldLegend>Portionen</FieldLegend>
      <FieldDescription>
        Die Standardportion ist immer 100 gramm groß. Für das Tracken sind verschiedene Portionsgrößen sehr praktisch!
      </FieldDescription>
      <FieldGroup className="gap-2">
        {fields.map((arrayField, index) => (
          <div key={arrayField.id} className="flex flex-col gap-2 p-2 border border-border rounded-md">
            <div className="flex justify-between gap-2">
              <Controller name={`portions.${index}.name`}
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="gap-1.5"
                    orientation="vertical"
                  >
                    <FieldDescription className="sr-only">Der Name der Portion</FieldDescription>
                    <ButtonGroup>
                      <ButtonGroupText asChild>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      </ButtonGroupText>
                      <InputGroup className="flex-1">
                        <InputGroupInput
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          {...field}
                        />
                      </InputGroup>
                    </ButtonGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller name={`portions.${index}.grams`}
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="gap-1.5"
                    orientation="vertical"
                  >
                    <FieldDescription className="sr-only">Die Gramm Menge der Portion</FieldDescription>
                    <ButtonGroup>
                      <ButtonGroupText asChild>
                        <FieldLabel htmlFor={field.name}>Menge</FieldLabel>
                      </ButtonGroupText>
                      <InputGroup className="flex-1">
                        <InputGroupInput
                          id={field.name}
                          className="text-right"
                          aria-invalid={fieldState.invalid}
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={event => {
                            const value = event.target.value
                            const numValue = +value
                            const onChangeValue = value === "" || isNaN(numValue)
                              ? null
                              : Math.floor((Math.min(Math.max(numValue, 0), 9999)))
                            field.onChange(onChangeValue)
                            if (fieldState.isTouched) field.onBlur() // trigger onBlur at onChange event (level): onBlur triggers validation "onInput"
                          }}
                          onFocus={(e) => e.target.select()}
                        />
                        <InputGroupAddon align="inline-end">g</InputGroupAddon>
                      </InputGroup>
                    </ButtonGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Separator />

            <div className="flex justify-between gap-2 h-8">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => remove(index)}
              >
                <Trash2Icon />
              </Button>
              <Separator orientation="vertical" />
              <Controller name={`portions.${index}.isDefault`}
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    className="col-span-2"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel
                      htmlFor={`${arrayField.id}-checkbox`}
                      className="font-normal"
                    >
                      Als Standard festlegen?
                    </FieldLabel>
                    <Checkbox
                      id={`${arrayField.id}-checkbox`}
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleDefaultSelect(index)
                        } else {
                          field.onChange(checked)
                        }
                      }}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
            </div>

          </div>
        ))}
        {formState.errors.portions && (
          <FieldError errors={[formState.errors.portions]} />
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={() => append({
            name: "",
            grams: 50,
            isDefault: false
          }, {
            shouldFocus: false
          })}
        >
          <ListPlusIcon /> Portion hinzufügen
        </Button>
      </FieldGroup>
    </FieldSet>
  );
}
