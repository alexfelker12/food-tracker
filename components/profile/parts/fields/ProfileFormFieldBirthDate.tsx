"use client"

import { Controller, useFormContext } from "react-hook-form";

import { ProfileSchema } from "@/schemas/types";

import { DateField } from "@/components/form-fields/DateField";


export function ProfileFormFieldBirthDate() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="userDataStep.birthDate"
      control={control}
      render={({ field, fieldState }) => (
        <DateField
          field={field}
          fieldState={fieldState}
          label="Geburtsdatum"
          description="Daraus leiten wir dein Alter ab"
          placeholder="Geburtsdatum"
        />
      )}
    />
  );
}
