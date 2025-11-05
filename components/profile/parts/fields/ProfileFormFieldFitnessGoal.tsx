"use client"

import { Controller, useFormContext } from "react-hook-form";

import { FitnessGoalEnum, GenderEnum, ProfileSchema } from "@/schemas/profileSchema";

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fitnessGoalLabels, genderLabels } from "@/schemas/labels/profileSchemaLabels";


export function ProfileFormFieldFitnessGoal() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="step2.fitnessGoal"
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor="step2.fitnessGoal">
              Abnehmziel
            </FieldLabel>
            <FieldDescription>
              Bestimme dein Ziel in dieser App
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
          <Select
            name={field.name}
            value={field.value ?? ""}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id="step2.fitnessGoal"
              aria-invalid={fieldState.invalid}
            >
              <SelectValue placeholder="Fitness-Ziel" />
            </SelectTrigger>
            <SelectContent position="popper">
              {FitnessGoalEnum.options.map((goal) => (
                <SelectItem key={goal} value={goal}>{fitnessGoalLabels[goal]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}
