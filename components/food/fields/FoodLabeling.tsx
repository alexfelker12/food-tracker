"use client"

import { Controller, useFormContext } from "react-hook-form";

import { FoodWithPortionsSchema } from "@/schemas/types";

import { LabeledTextField } from "@/components/form-fields/LabeledTextField";
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";


export function FoodLabeling() {
  const { control } = useFormContext<FoodWithPortionsSchema>();

  return (
    <FieldSet>
      <FieldLegend>Bezeichnung</FieldLegend>
      <FieldDescription className="sr-only">
        Gebe die Bezeichnung und Marke des Lebensmittels an
      </FieldDescription>
      <FieldGroup className="gap-2">
        <Controller name="food.name"
          control={control}
          render={({ field, fieldState }) => (
            <LabeledTextField
              field={field}
              fieldState={fieldState}
              label="Name"
              description="Handelsüblicher Name des Lebensmittel"
              placeholder="Apfel, Banane, ..."
            />
          )}
        />
        <Controller name="food.brand"
          control={control}
          render={({ field, fieldState }) => (
            <LabeledTextField
              field={field}
              fieldState={fieldState}
              label="Marke"
              description="Dies hilft das Lebensmittel beim Suchen einzugrenzen"
              placeholder="Edeka, Lidl, ... (optional)"
            />
          )}
        />
      </FieldGroup>
    </FieldSet>
  );
}
