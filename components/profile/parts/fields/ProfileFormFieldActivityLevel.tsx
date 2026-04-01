"use client"

import { Controller, useFormContext } from "react-hook-form";

import { activityLevelLabels } from "@/schemas/labels/profileSchemaLabels";
import { ActivityLevelEnum } from "@/schemas/profileSchema";
import { ProfileSchema } from "@/schemas/types";

import { EnumFieldInput } from "@/components/form-fields/EnumField";
import { ActivityLevelInformation } from "@/components/information/ActivityLevelInformation";
import { InformationDialog } from "@/components/information/InformationDialog";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";


export function ProfileFormFieldActivityLevel() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="fitnessProfileStep.activityLevel"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor={field.name}>
              Aktivitätslevel
            </FieldLabel>
            <FieldDescription>
              Wie aktiv bist du?
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>

          <ButtonGroup>
            <EnumFieldInput
              field={field}
              fieldState={fieldState}
              options={ActivityLevelEnum.options}
              labels={activityLevelLabels}
              placeholder="Level auswählen"
            />

            <InformationDialog
              title="Dein Aktivitätslevel"
              description="Hier findest du für die korrekte Auswahl genauere Informationen zu jedem Aktivitätslevel"
            >
              <div className="space-y-3">
                <ActivityLevelInformation activityLevel="VERY_LOW" />
                <ActivityLevelInformation activityLevel="LOW" />
                <ActivityLevelInformation activityLevel="MEDIUM" />
                <ActivityLevelInformation activityLevel="HIGH" />
                <ActivityLevelInformation activityLevel="VERY_HIGH" />
              </div>
            </InformationDialog>
          </ButtonGroup>

        </Field>
      )}
    />
  );
}
