"use client"

import { Controller, useFormContext } from "react-hook-form";

import { ActivityLevelEnum, ProfileSchema } from "@/schemas/profileSchema";

import { activityLevelLabels } from "@/schemas/labels/profileSchemaLabels";
import { EnumField } from "./EnumField";


export function ProfileFormFieldActivityLevel() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="step2.activityLevel"
      control={control}
      render={({ field, fieldState }) => (
        <EnumField
          field={field}
          fieldState={fieldState}
          label="Aktivitätslevel"
          description="Wie aktiv bist du?"
          placeholder="Level auswählen"
          options={ActivityLevelEnum.options}
          labels={activityLevelLabels}
        />
      )}
    />
  );
}
