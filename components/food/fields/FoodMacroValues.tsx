"use client"

import { Controller, useFormContext } from "react-hook-form";

import { FoodWithPortionsSchema } from "@/schemas/types";

import { CompactNumField } from "@/components/form-fields/CompactNumField";
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";


export function FoodMacroValues() {
  const { control } = useFormContext<FoodWithPortionsSchema>();

  return (
    <FieldSet>
      <FieldLegend>Makronährwerte - pro 100 gramm</FieldLegend>
      <FieldDescription className="sr-only">
        Gebe die Gramm Menge für jeden Makronährwert an
      </FieldDescription>
      <FieldGroup className="gap-2">
        <Controller name="food.kcal"
          control={control}
          render={({ field, fieldState }) => (
            <CompactNumField
              field={field}
              fieldState={fieldState}
              label="Kalorien"
              description="Kalorien des Lebensmittels pro 100 gramm"
              unit="kcal / 100g"
            />
          )}
        />
        <Controller name="food.fats"
          control={control}
          render={({ field, fieldState }) => (
            <CompactNumField
              field={field}
              fieldState={fieldState}
              label="Fette"
              description="Fettmenge in gramm des Lebensmittels pro 100 gramm"
              unit="g / 100g"
            />
          )}
        />
        <Controller name="food.carbs"
          control={control}
          render={({ field, fieldState }) => (
            <CompactNumField
              field={field}
              fieldState={fieldState}
              label="Kohlenhydrate"
              description="Kohlenhydratmenge in gramm des Lebensmittels pro 100 gramm"
              unit="g / 100g"
            />
          )}
        />
        <Controller name="food.protein"
          control={control}
          render={({ field, fieldState }) => (
            <CompactNumField
              field={field}
              fieldState={fieldState}
              label="Proteine"
              description="Proteinmenge des Lebensmittels pro 100 gramm"
              unit="g / 100g"
            />
          )}
        />
      </FieldGroup>
    </FieldSet >
  );
}
