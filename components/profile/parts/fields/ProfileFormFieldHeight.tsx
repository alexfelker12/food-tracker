"use client"

import { Controller, useFormContext } from "react-hook-form";

import { ProfileSchema } from "@/schemas/profileSchema";

import { NumField } from "./NumField";


export function ProfileFormFieldHeight() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="step1.heightCm"
      control={control}
      render={({ field, fieldState }) => (
        <NumField
          field={field}
          fieldState={fieldState}
          label="Größe"
          description="Gebe bitte deine Größe an"
          placeholder="160"
          unit="cm"
        />
      )}
    />
  );
}
