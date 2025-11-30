"use client"

import { Controller, useFormContext } from "react-hook-form";

import { ProfileSchema } from "@/schemas/types";

import { NumField } from "@/components/form-fields/NumField";


export function ProfileFormFieldWeight() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="bodyDataStep.weightKg"
      control={control}
      render={({ field, fieldState }) => (
        <NumField
          field={field}
          fieldState={fieldState}
          label="Gewicht"
          description="Gebe bitte dein Gewicht an"
          placeholder="60"
          unit="kg"
        />
      )}
    />
  );
}
