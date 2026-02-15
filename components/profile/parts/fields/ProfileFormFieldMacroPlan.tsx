"use client"

import { Controller, useFormContext } from "react-hook-form";

import { macroSplitLabels } from "@/schemas/labels/profileSchemaLabels";
import { MacroSplitEnum } from "@/schemas/profileSchema";
import { ProfileSchema } from "@/schemas/types";

import { DetailedEnumField } from "@/components/form-fields/DetailedEnumField";


export function ProfileFormFieldMacroPlan() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="macroSplitStep.macroSplit"
      control={control}
      render={({ field, fieldState }) => (
        <DetailedEnumField
          field={field}
          fieldState={fieldState}
          label="Makroverteilung"
          description="Wähle die für dich passende Makroverteilung aus"
          placeholder="Makro-Plan"
          options={MacroSplitEnum.options}
          labels={macroSplitLabels}
          compact
        />
      )}
    />
  );
}
