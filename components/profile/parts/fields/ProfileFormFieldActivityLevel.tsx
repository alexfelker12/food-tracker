"use client"

import { Controller, useFormContext } from "react-hook-form";

import { activityLevelLabels } from "@/schemas/labels/profileSchemaLabels";
import { ActivityLevelEnum } from "@/schemas/profileSchema";
import { ProfileSchema } from "@/schemas/types";

import { EnumFieldInput } from "@/components/form-fields/EnumField";
import { ActivityLevelInformation } from "@/components/information/ActivityLevelInformation";
import { InformationDialog } from "@/components/information/InformationDialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
              <Accordion type="single" defaultValue="VERY_LOW">

                <AccordionItem value="VERY_LOW">
                  <AccordionTrigger className="text-base">{activityLevelLabels["VERY_LOW"]}</AccordionTrigger>
                  <AccordionContent>
                    <ActivityLevelInformation activityLevel="VERY_LOW" />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="LOW">
                  <AccordionTrigger className="text-base">{activityLevelLabels["LOW"]}</AccordionTrigger>
                  <AccordionContent>
                    <ActivityLevelInformation activityLevel="LOW" />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="MEDIUM">
                  <AccordionTrigger className="text-base">{activityLevelLabels["MEDIUM"]}</AccordionTrigger>
                  <AccordionContent>
                    <ActivityLevelInformation activityLevel="MEDIUM" />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="HIGH">
                  <AccordionTrigger className="text-base">{activityLevelLabels["HIGH"]}</AccordionTrigger>
                  <AccordionContent>
                    <ActivityLevelInformation activityLevel="HIGH" />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="VERY_HIGH">
                  <AccordionTrigger className="text-base">{activityLevelLabels["VERY_HIGH"]}</AccordionTrigger>
                  <AccordionContent>
                    <ActivityLevelInformation activityLevel="VERY_HIGH" />
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </InformationDialog>

          </ButtonGroup>

        </Field>
      )}
    />
  );
}
