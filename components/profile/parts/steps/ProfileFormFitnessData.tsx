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

export function ProfileFormFitnessData() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <FieldGroup>
      {/* email */}
      <Controller
        name="step2.email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="step2.email">
              Email
            </FieldLabel>
            <Input
              {...field}
              type="email"
              id="step2.email"
              aria-invalid={fieldState.invalid}
              placeholder="example@mail.com"
              autoComplete="off"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      {/* age */}
      <Controller
        name="step2.age"
        control={control}
        render={({ field, fieldState }) =>
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="step2.age">
              Age
            </FieldLabel>
            <Input
              {...field}
              type="number"
              id="step2.age"
              aria-invalid={fieldState.invalid}
              // convert to number
              onChange={event => field.onChange(+event.target.value)}
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        }
      />
    </FieldGroup>
  );
}
