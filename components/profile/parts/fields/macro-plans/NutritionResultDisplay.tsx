"use client"

import { getGermanNumber } from "@/lib/utils";

import { GridData, GridDataSection } from "@/components/GridData";

import { SelectedPlanProps } from "./registry";


export function NutritionResultDisplay({ nutritionResult, planValidity }: SelectedPlanProps) {
  // macro values
  const {
    calorieGoalMin, calorieGoalMax,
    proteinsMinGrams, proteinsMaxGrams,
    fatsMinGrams, fatsMaxGrams,
    carbsMinGrams, carbsMaxGrams,
  } = nutritionResult

  const calorieGoalMinText = getGermanNumber(calorieGoalMin, 0)
  const calorieGoalMaxText = getGermanNumber(calorieGoalMax, 0)
  const proteinsMin = getGermanNumber(proteinsMinGrams, 0)
  const proteinsMax = getGermanNumber(proteinsMaxGrams, 0)
  const fatsMin = getGermanNumber(fatsMinGrams, 0)
  const fatsMax = getGermanNumber(fatsMaxGrams, 0)
  const carbsMin = getGermanNumber(carbsMinGrams, 0)
  const carbsMax = getGermanNumber(carbsMaxGrams, 0)

  return (
    // TODO: Maybe copy this to onboard success dialog
    <GridDataSection label="Resultierende Nährwerte">
      {/* calorieGoal */}
      <GridData className="gap-x-1 gap-y-2 grid grid-cols-[1fr_auto_auto_auto] grid-row-4">
        <span data-slot="grid-data-label">Kalorien-Ziel</span>
        <span>{calorieGoalMinText}<span className="ml-0.5 text-muted-foreground">kcal</span></span>
        <span className="text-muted-foreground">-</span>
        <span>{calorieGoalMaxText}<span className="ml-0.5 text-muted-foreground">kcal</span></span>
        {/* </GridData>

      <GridData className="gap-2 gap-x-1 grid grid-cols-[1fr_auto_auto_auto] grid-row-3"> */}
        {/* proteins */}
        {planValidity.isProteinAmountValid ? (
          <>
            <span data-slot="grid-data-label">Proteine</span>
            <span>{proteinsMin}<span className="ml-0.5 text-muted-foreground">g</span></span>
            <span className="text-muted-foreground">-</span>
            <span>{proteinsMax}<span className="ml-0.5 text-muted-foreground">g</span></span>
          </>
        ) : (
          <>
            <span className="text-destructive text-start">Proteine</span>
            <span className="col-span-3 text-destructive">ungültig</span>
          </>
        )}

        {/* fats */}
        {planValidity.isFatAmountValid ? (
          <>
            <span data-slot="grid-data-label">Fette</span>
            <span>{fatsMin}<span className="ml-0.5 text-muted-foreground">g</span></span>
            <span className="text-muted-foreground">-</span>
            <span>{fatsMax}<span className="ml-0.5 text-muted-foreground">g</span></span>
          </>
        ) : (
          <>
            <span className="text-destructive text-start">Fette</span>
            <span className="col-span-3 text-destructive">ungültig</span>
          </>
        )}

        {/* carbs*/}
        {planValidity.isCarbAmountValid ? (
          <>
            <span data-slot="grid-data-label">Carbs</span>
            <span>{carbsMin}<span className="ml-0.5 text-muted-foreground">g</span></span>
            <span className="text-muted-foreground">-</span>
            <span>{carbsMax}<span className="ml-0.5 text-muted-foreground">g</span></span>
          </>
        ) : (
          <>
            <span className="text-destructive text-start">Carbs</span>
            <span className="col-span-3 text-destructive">ungültig</span>
          </>
        )}
      </GridData>
    </GridDataSection>
  );
}
