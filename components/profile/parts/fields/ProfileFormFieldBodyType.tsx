"use client"

import { Controller, useFormContext } from "react-hook-form";

import { BodyTypeEnum, ProfileSchema } from "@/schemas/profileSchema";

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bodyTypeLabels } from "@/schemas/labels/profileSchemaLabels";


export function ProfileFormFieldBodyType() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="step1.bodyType"
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor="step1.bodyType">
              Körpertyp
            </FieldLabel>
            <FieldDescription>
              Selbsteinschätzung deines Körpertyps
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
          <Select
            name={field.name}
            value={field.value ?? ""}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id="step1.bodyType"
              aria-invalid={fieldState.invalid}
            >
              <SelectValue placeholder="Körpertyp" />
            </SelectTrigger>
            <SelectContent position="popper">
              {BodyTypeEnum.options.map((bodyType) => (
                <SelectItem key={bodyType} value={bodyType}>{bodyTypeLabels[bodyType]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}
