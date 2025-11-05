"use client"

import { Controller, useFormContext } from "react-hook-form";

import { ActivityLevelEnum, GenderEnum, ProfileSchema } from "@/schemas/profileSchema";

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { activityLevelLabels, genderLabels } from "@/schemas/labels/profileSchemaLabels";


export function ProfileFormFieldActivityLevel() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="step2.activityLevel"
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor="step2.activityLevel">
              Aktivitätslevel
            </FieldLabel>
            <FieldDescription>
              Wie viel bewegst du dich täglich?
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
          <Select
            name={field.name}
            value={field.value ?? ""}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id="step2.activityLevel"
              aria-invalid={fieldState.invalid}
            >
              <SelectValue placeholder="Aktivitätslevel" />
            </SelectTrigger>
            <SelectContent position="popper">
              {ActivityLevelEnum.options.map((level) => (
                <SelectItem key={level} value={level}>{activityLevelLabels[level]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}
