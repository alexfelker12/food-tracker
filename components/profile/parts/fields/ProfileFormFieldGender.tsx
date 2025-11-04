"use client"

import { Controller, useFormContext } from "react-hook-form";

import { ProfileSchema } from "@/schemas/profileSchema";

import {
  Field,
  FieldError,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// example field for actual profile schema

export function ProfileFormBodyData() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="step1.firstName"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="step1.firstName">
            Firstname
          </FieldLabel>
          <Input
            {...field}
            id="step1.firstName"
            aria-invalid={fieldState.invalid}
            placeholder="Firstname"
            autoComplete="off"
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}
