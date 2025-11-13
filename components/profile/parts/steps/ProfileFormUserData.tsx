import { Suspense } from "react";

import { FieldDescription, FieldGroup, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { ProfileFormFieldBirthDate } from "../fields/ProfileFormFieldBirthDate";
import { ProfileFormFieldGender } from "../fields/ProfileFormFieldGender";


export function ProfileFormUserData() {
  return (
    <FieldSet>
      <FieldLegend>Über dich</FieldLegend>
      <FieldDescription>
        Deine persönlichen Daten helfen uns dein Tracking-Ziel zu spezifizieren
      </FieldDescription>

      <FieldSeparator />

      <FieldGroup>
        <Suspense>
          <ProfileFormFieldBirthDate />
        </Suspense>
        <ProfileFormFieldGender />
      </FieldGroup>
    </FieldSet >
  );
}
