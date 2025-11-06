"use client"

import { Controller, FieldPath, useFormContext } from "react-hook-form";

import { GenderEnum, ProfileSchema } from "@/schemas/profileSchema";

import { genderLabels } from "@/schemas/labels/profileSchemaLabels";
import { EnumField } from "./EnumField";


export function ProfileFormFieldGender() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="step1.gender"
      control={control}
      render={({ field, fieldState }) => (
        <EnumField
          field={field}
          fieldState={fieldState}
          label="Geschlecht"
          description="Dies beeinflusst das Kalorien-Ziel"
          placeholder="Geschlecht"
          options={GenderEnum.options}
          labels={genderLabels}
        />
      )}
    />
  );
}
