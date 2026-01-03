"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"

import { TrackingWeekDays } from "./components/TrackingWeekDays"


export function FoodTrackDays() {
  const { control } = useFormContext()

  return (
    <Controller name="daysToTrack"
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
        >
          <FieldContent className="gap-1">
            <FieldLabel htmlFor={field.name}>Für mehrere Tage tracken</FieldLabel>
            <FieldDescription className="sr-only">Tracke heute und bis zu den nächsten 6 Tagen</FieldDescription>
          </FieldContent>

          <TrackingWeekDays
            field={field}
            fieldState={fieldState}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}