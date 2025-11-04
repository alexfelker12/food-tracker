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
import { Checkbox } from "@/components/ui/checkbox";

export function ProfileFormSplitData() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <FieldGroup>

      <Controller
        name="step3.agreeTerms"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex gap-2">
              <Checkbox
                id="step3.agreeTerms"
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
              <FieldLabel htmlFor="step3.agreeTerms">
                Agree terms
              </FieldLabel>
            </div>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />


    </FieldGroup>
  );
}
