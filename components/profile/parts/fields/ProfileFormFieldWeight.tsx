"use client"

import { Controller, useFormContext } from "react-hook-form";

import { ProfileSchema } from "@/schemas/profileSchema";

import { cn } from "@/lib/utils";

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";


export function ProfileFormFieldWeight() {
  const { control } = useFormContext<ProfileSchema>();

  const placeholder = "60"

  return (
    <Controller
      name="step1.weightKg"
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor="step1.weightKg">
              Gewicht
            </FieldLabel>
            <FieldDescription>
              Gebe bitte dein Gewicht an
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
          <InputGroup
            className="flex-none w-auto"
          >
            <InputGroupInput
              id="step1.weightKg"
              className={cn("flex-none max-w-9",
                (field.value || +placeholder) > 99 ? "max-w-11" : (field.value || +placeholder) > 9 ? "max-w-9" : "max-w-7"
              )}
              type="number"
              min={0}
              max={999}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
              {...field}
              value={field.value ?? ""}
              // overwrite onChange - convert to number
              onChange={event => field.onChange(+event.target.value || null)}
              onFocus={(e) => {
                e.target.select();
              }}
            />
            <InputGroupAddon align="inline-end">kg</InputGroupAddon>
          </InputGroup>
        </Field>
      )}
    />
  );
}
