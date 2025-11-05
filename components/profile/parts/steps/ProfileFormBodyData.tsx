"use client"

import { FieldDescription, FieldGroup, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { ProfileFormFieldGender } from "../fields/ProfileFormFieldGender";
import { ProfileFormFieldAge } from "../fields/ProfileFormFieldAge";
import { ProfileFormFieldHeight } from "../fields/ProfileFormFieldHeight";
import { ProfileFormFieldWeight } from "../fields/ProfileFormFieldWeight";
import { ProfileFormFieldBodyType } from "../fields/ProfileFormFieldBodyType";


export function ProfileFormBodyData() {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Körperdaten</FieldLegend>
        <FieldDescription>
          Die Angaben sind wichtig, um dein optimales Kalorienziel zu errechnen
        </FieldDescription>
      </FieldSet>

      <FieldSeparator />

      <ProfileFormFieldGender />
      <ProfileFormFieldAge />
      <ProfileFormFieldHeight />
      <ProfileFormFieldWeight />
      <ProfileFormFieldBodyType />

    </FieldGroup>
  );
}
