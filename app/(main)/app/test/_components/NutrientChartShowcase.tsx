"use client"

import { NutrientDisplayDetailed } from "@/components/nutrient/NutrientDisplayDetailed";
import { NutrientDisplayRow } from "@/components/nutrient/NutrientDisplayRow";


// sample data showing various statuses
const sampleData = {
  calories: { current: 1700, min: 1800, max: 2200 },
  protein: { current: 50, min: 80, max: 120 },
  carbs: { current: 220, min: 200, max: 280 },
  fat: { current: 65, min: 50, max: 80 },
}

export function NutrientChartShowcase() {
  return (
    <div className="space-y-8 mx-auto max-w-lg">

      <div className="pt-4 text-center">
        <h1 className="font-bold text-foreground text-xl">Nutrient Chart Showcase</h1>
        <p className="mt-1 text-muted-foreground text-sm">Responsive Graphen mit Ampellicht-Färbung</p>
      </div>

      <section className="space-y-2">
        <h2 className="font-semibold text-base text-foreground">Variante angereihte Graphen</h2>

        <NutrientDisplayRow {...sampleData} label="Offene Nährwerte" />
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-base text-foreground">Variante mit kleineren Kreis Graphen</h2>

        <NutrientDisplayDetailed
          calories={{ current: 1650, min: 1800, max: 2200 }}
          protein={{ current: 95, min: 80, max: 120 }}
          carbs={{ current: 180, min: 200, max: 280 }}
          fat={{ current: 40, min: 50, max: 80 }}
        />
      </section>

    </div>
  );
}