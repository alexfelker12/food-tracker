"use client"

import { useFormContext, Controller } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { ProfileSchema } from "@/schemas/profileSchema";


// enum BodyType {
//   VERY_ATHELTIC
//   ATHELTIC
//   AVERAGE
//   SLIGHTLY_OVERWEIGHT
//   MORE_OVERWEIGHT
// }
// gender   Gender
// age      Int
// heightCm Int
// weightKg Float
// bodyType BodyType



export function ProfileFormBodyData() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <FieldGroup>
      {/* firstname */}
      <Controller
        name="step1.firstName"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="step1.firstName">
              Firstname
            </FieldLabel>
            <Input
              {...field}
              id="step1.firstName"
              aria-invalid={fieldState.invalid}
              placeholder="Firstname"
              autoComplete="off"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      {/* lastname */}
      <Controller
        name="step1.lastName"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="step1.lastName">
              Lastname
            </FieldLabel>
            <Input
              {...field}
              id="step1.lastName"
              aria-invalid={fieldState.invalid}
              placeholder="Lastname"
              autoComplete="off"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
