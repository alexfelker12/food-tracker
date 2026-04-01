"use client"

import { Controller, useFormContext } from "react-hook-form";

import { fitnessGoalLabels } from "@/schemas/labels/profileSchemaLabels";
import { FitnessGoalEnum } from "@/schemas/profileSchema";
import { ProfileSchema } from "@/schemas/types";

import { EnumFieldInput } from "@/components/form-fields/EnumField";
import { InformationDialog } from "@/components/information/InformationDialog";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { ButtonGroup } from "@/components/ui/button-group";
import { FitnessGoalInformation } from "@/components/information/FitnessGoalInformation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


export function ProfileFormFieldFitnessGoal() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="fitnessProfileStep.fitnessGoal"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor={field.name}>
              Fitness-Ziel
            </FieldLabel>
            <FieldDescription>
              Wähle dein Tracking-Ziel
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>


          <ButtonGroup>
            <EnumFieldInput
              field={field}
              fieldState={fieldState}
              options={FitnessGoalEnum.options}
              labels={fitnessGoalLabels}
              placeholder="Ziel auswählen"
            />

            <InformationDialog
              title="Dein Fitness-Ziel"
              description="Hier findest du für die korrekte Auswahl genauere Informationen zu jedem Fitness-Ziel"
            >
              <Accordion type="single" collapsible defaultValue="QUICKLY_LOSE_WEIGHT">
                <AccordionItem value="QUICKLY_LOSE_WEIGHT">
                  <AccordionTrigger className="text-base">{fitnessGoalLabels["QUICKLY_LOSE_WEIGHT"]}</AccordionTrigger>
                  <AccordionContent>
                    <FitnessGoalInformation fitnessGoal="QUICKLY_LOSE_WEIGHT" />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="LOSE_WEIGHT">
                  <AccordionTrigger className="text-base">{fitnessGoalLabels["LOSE_WEIGHT"]}</AccordionTrigger>
                  <AccordionContent>
                    <FitnessGoalInformation fitnessGoal="LOSE_WEIGHT" />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="MAINTAIN">
                  <AccordionTrigger className="text-base">{fitnessGoalLabels["MAINTAIN"]}</AccordionTrigger>
                  <AccordionContent>
                    <FitnessGoalInformation fitnessGoal="MAINTAIN" />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="GAIN_WEIGHT">
                  <AccordionTrigger className="text-base">{fitnessGoalLabels["GAIN_WEIGHT"]}</AccordionTrigger>
                  <AccordionContent>
                    <FitnessGoalInformation fitnessGoal="GAIN_WEIGHT" />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="QUICKLY_GAIN_WEIGHT">
                  <AccordionTrigger className="text-base">{fitnessGoalLabels["QUICKLY_GAIN_WEIGHT"]}</AccordionTrigger>
                  <AccordionContent>
                    <FitnessGoalInformation fitnessGoal="QUICKLY_GAIN_WEIGHT" />
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
