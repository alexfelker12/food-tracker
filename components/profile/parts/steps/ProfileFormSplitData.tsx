import { FieldDescription, FieldGroup, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { ProfileFormFieldMacroPlan } from "../fields/ProfileFormFieldMacroPlan";
import { ProfileFormFieldSelectedPlan } from "../fields/ProfileFormFieldSelectedPlan";

export function ProfileFormSplitData() {
  return (
    <FieldSet>
      <FieldLegend>Makronährstoffverteilung</FieldLegend>
      <FieldDescription className="">
        Nutze unsere empfohlenen Werte oder passe selbst an, wie sich die Makronährstoffe <strong>Fette</strong>, <strong>Kohlenhydrate</strong> und <strong>Proteine</strong> in deinem Kalorienhaushalt verteilen sollen
      </FieldDescription>

      <FieldSeparator />

      <FieldGroup>
        <ProfileFormFieldMacroPlan />
        {/* <ProfileFormFieldMacroSplits initialRecommended={true} /> */}
        <ProfileFormFieldSelectedPlan />
      </FieldGroup>
    </FieldSet>
  );
}
