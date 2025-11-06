"use client"

import { Controller, useFormContext } from "react-hook-form";

import { FitnessGoalEnum, ProfileSchema } from "@/schemas/profileSchema";

import { fitnessGoalLabels } from "@/schemas/labels/profileSchemaLabels";
import { EnumField } from "./EnumField";


export function ProfileFormFieldFitnessGoal() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="step2.fitnessGoal"
      control={control}
      render={({ field, fieldState }) => (
        <EnumField
          field={field}
          fieldState={fieldState}
          label="Fitness-Ziel"
          description="Wähle dein Tracking-Ziel"
          placeholder="Ziel auswählen"
          options={FitnessGoalEnum.options}
          labels={fitnessGoalLabels}
        />
      )}
    />
  );
}
