"use client"

import { Controller, useFormContext } from "react-hook-form";

import { GenderEnum } from "@/schemas/profileSchema";
import { ProfileSchema } from "@/schemas/types";

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
