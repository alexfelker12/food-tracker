"use client"

import { FieldDescription, FieldGroup, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { ProfileFormFieldActivityLevel } from "../fields/ProfileFormFieldActivityLevel";
import { ProfileFormFieldFitnessGoal } from "../fields/ProfileFormFieldFitnessGoal";
import { ProfileFormFieldTrainingDays } from "../fields/ProfileFormFieldTrainingDays";


export function ProfileFormFitnessData() {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Fitnessdaten</FieldLegend>
        <FieldDescription>
          Gebe dein Aktivitätslevel und Fitness-Ziel an. Dies wirkt sich besonders auf dein Kalorien-Ziel aus
        </FieldDescription>
      </FieldSet>

      <FieldSeparator />

      <ProfileFormFieldFitnessGoal />
      <ProfileFormFieldActivityLevel />
      <ProfileFormFieldTrainingDays />

    </FieldGroup>
  );
}
