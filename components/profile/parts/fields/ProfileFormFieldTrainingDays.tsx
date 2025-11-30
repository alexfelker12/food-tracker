"use client"

import { Controller, useFormContext } from "react-hook-form";

import { ProfileSchema } from "@/schemas/types";

import { NumField } from "@/components/form-fields/NumField";


export function ProfileFormFieldTrainingDays() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="fitnessProfileStep.trainingDaysPerWeek"
      control={control}
      render={({ field, fieldState }) => (
        <NumField
          field={field}
          fieldState={fieldState}
          label="Trainingstage"
          description="Gebe an, wie viele Trainingseinheiten du in der Woche ausführst"
          placeholder="0"
          unit="/ Woche"
        />
      )}
    />
  );
}
