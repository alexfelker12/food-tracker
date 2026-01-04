"use client"

import { Controller, useFormContext } from "react-hook-form"

import { XIcon } from "lucide-react"

import { NumFieldInput } from "@/components/form-fields/NumField"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FoodTrackFormProps } from "../FoodTrackForm"
import { useFoodTrack } from "./FoodTrackProvider"
// import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"


export function FoodTrackPortionAmount() {
  const { control } = useFormContext()
  const { consumable } = useFoodTrack()

  return (
    <Controller name="portionAmount"
      control={control}
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
                <InputGroupAddon align="inline-end" className="pt-2.5 pr-2 pb-0.5">
                  <XIcon className="text-muted-foreground size-3" />
                </InputGroupAddon>
              </InputGroup>
              <Controller name="portionId"
                control={control}
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
  );
}