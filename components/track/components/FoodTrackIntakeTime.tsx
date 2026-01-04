"use client"

import { Controller, useFormContext } from "react-hook-form"

import { IntakeTimeEnum } from "@/schemas/journal/journalEntrySchema"
import { intakeTimeLabels } from "@/schemas/labels/journalEntrySchemaLabels"

import { EnumField } from "@/components/form-fields/EnumField"


export function FoodTrackIntakeTime() {
  const { control } = useFormContext()

  return (
    <Controller name="intakeTime"
      control={control}
      render={({ field, fieldState }) => (
        <EnumField
          field={field}
          fieldState={fieldState}
          label="Mahlzeit"
          description="Wähle die Essenszeit aus"
          placeholder="Mahlzeit"
          compact
          options={IntakeTimeEnum.options}
          labels={intakeTimeLabels}
        />
      )}
    />
  );
}