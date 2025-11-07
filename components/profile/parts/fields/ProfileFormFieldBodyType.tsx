"use client"

import { Controller, useFormContext } from "react-hook-form";

import { BodyTypeEnum } from "@/schemas/profileSchema";
import { ProfileSchema } from "@/schemas/types";

import { bodyTypeLabels } from "@/schemas/labels/profileSchemaLabels";
import { EnumField } from "./EnumField";


export function ProfileFormFieldBodyType() {
  const { control } = useFormContext<ProfileSchema>();

  return (
    <Controller
      name="step1.bodyType"
      control={control}
      render={({ field, fieldState }) => (
        <EnumField
          field={field}
          fieldState={fieldState}
          label="Körpertyp"
          description="Selbsteinschätzung deines Körpertyps."
          placeholder="Körpertyp"
          options={BodyTypeEnum.options}
          labels={bodyTypeLabels}
        />
      )}
    />
  );
}
