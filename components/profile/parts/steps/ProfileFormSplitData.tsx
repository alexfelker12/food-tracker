import { FieldDescription, FieldGroup, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { ProfileFormFieldMacroSplits } from "../fields/ProfileFormFieldMacroSplits";
import { ProfileFormFieldRecommended } from "../fields/ProfileFormFieldRecommended";

export function ProfileFormSplitData() {
  return (
    <FieldSet>
      <FieldLegend>Makronährstoffverteilung</FieldLegend>
      <FieldDescription className="">
        Nutze unsere empfohlenen Werte oder passe selbst an, wie sich die Makronährstoffe <strong>Fette</strong>, <strong>Kohlenhydrate</strong> und <strong>Proteine</strong> in deinen Kalorienhaushalt verteilen sollen
      </FieldDescription>

      <FieldSeparator />

      <FieldGroup>
        <ProfileFormFieldRecommended />
        <ProfileFormFieldMacroSplits initialRecommended={true} />
      </FieldGroup>
    </FieldSet>
  );
}
