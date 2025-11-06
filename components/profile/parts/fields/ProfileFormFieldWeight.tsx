"use client"

import { Controller, useFormContext } from "react-hook-form";

import { ProfileSchema } from "@/schemas/profileSchema";

import { NumField } from "./NumField";


export function ProfileFormFieldWeight() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="step1.weightKg"
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
