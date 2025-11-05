"use client"

import { FieldDescription, FieldGroup, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { ProfileFormFieldMacroSplits } from "../fields/ProfileFormFieldMacroSplits";

export function ProfileFormSplitData() {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Makronährstoffverteilung</FieldLegend>
        <FieldDescription>
          Passe an, wie sich die Makronährstoffe <strong>Fette</strong>, <strong>Kohlenhydrate</strong> und <strong>Proteine</strong> in deinen Kalorienhaushalt verteilen sollen
        </FieldDescription>
      </FieldSet>

      <FieldSeparator />

      <ProfileFormFieldMacroSplits />

    </FieldGroup>
  );
}
