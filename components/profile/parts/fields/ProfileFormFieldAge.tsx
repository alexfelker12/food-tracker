"use client"

import { Controller, useFormContext } from "react-hook-form";

import { ProfileSchema } from "@/schemas/profileSchema";

import { NumField } from "./NumField";


export function ProfileFormFieldAge() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="step1.age"
      control={control}
      render={({ field, fieldState }) => (
        <NumField
          field={field}
          fieldState={fieldState}
          label="Alter"
          description="Gebe bitte dein Alter an"
          placeholder="18"
          unit="Jahre"
        />
      )}
    />
  );
}
