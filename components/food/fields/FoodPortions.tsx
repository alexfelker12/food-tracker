"use client"

import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import { FoodWithPortionsSchema } from "@/schemas/types";

import { ListPlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";


export function FoodPortions() {
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

            <div className="flex justify-between items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => remove(index)}
              >
                <Trash2Icon />
              </Button>
              <Separator orientation="vertical" className="h-7!" />
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
