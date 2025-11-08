"use client"

import { FieldDescription, FieldGroup, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { ProfileFormFieldBodyType } from "../fields/ProfileFormFieldBodyType";
import { ProfileFormFieldHeight } from "../fields/ProfileFormFieldHeight";
import { ProfileFormFieldWeight } from "../fields/ProfileFormFieldWeight";


export function ProfileFormBodyData() {
  return (
    <FieldSet>
      <FieldLegend>Körperdaten</FieldLegend>
      <FieldDescription>
        Die Angaben sind wichtig, um dein optimales Kalorienziel zu errechnen
      </FieldDescription>

      <FieldSeparator />

      <FieldGroup>
        <ProfileFormFieldHeight />
        <ProfileFormFieldWeight />
        <ProfileFormFieldBodyType />
      </FieldGroup>
    </FieldSet>
  );
}
