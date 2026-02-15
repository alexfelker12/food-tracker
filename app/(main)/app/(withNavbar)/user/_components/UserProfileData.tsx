"use client"

import { activityLevelLabels, bodyTypeLabels, fitnessGoalLabels, genderLabels, macroSplitLabels } from "@/schemas/labels/profileSchemaLabels";

import { getGermanDate, getGermanNumber } from "@/lib/utils";

import { GridData, GridDataSection } from "@/components/GridData";
import { CardContent } from "@/components/ui/card";

import { useUserProfile } from "./UserProfileContext";


export function UserProfileData() {
  const { profile } = useUserProfile()

  const birthDate = getGermanDate(profile.birthDate)

  const calorieGoalMinText = getGermanNumber(profile.nutritionResult.calorieGoalMin, 0)
  const calorieGoalMaxText = getGermanNumber(profile.nutritionResult.calorieGoalMax, 0)
  const fatsMinText = getGermanNumber(profile.nutritionResult.fatsMinGrams, 0)
  const fatsMaxText = getGermanNumber(profile.nutritionResult.fatsMaxGrams, 0)
  const carbsMinText = getGermanNumber(profile.nutritionResult.carbsMinGrams, 0)
  const carbsMaxText = getGermanNumber(profile.nutritionResult.carbsMaxGrams, 0)
  const proteinsMinText = getGermanNumber(profile.nutritionResult.proteinsMinGrams, 0)
  const proteinsMaxText = getGermanNumber(profile.nutritionResult.proteinsMaxGrams, 0)

  return (
    <CardContent className="space-y-6 px-0">

      {/* user data */}
      <GridDataSection label="Benutzerdaten">
        <GridData>
          <span data-slot="grid-data-label">Geschlecht</span>
          <span>{genderLabels[profile.gender]}</span>
        </GridData>
        <GridData>
          <span data-slot="grid-data-label">Geburtsdatum</span>
          <span>{birthDate}</span>
        </GridData>
      </GridDataSection>

      {/* body data */}
      <GridDataSection label="Körperdaten">
        <GridData>
          <span data-slot="grid-data-label">Größe</span>
          <span>{profile.heightCm} cm</span>
        </GridData>
        <GridData>
          <span data-slot="grid-data-label">Gewicht</span>
          <span>{profile.weightKg} kg</span>
        </GridData>
        <GridData>
          <span data-slot="grid-data-label">Körpertyp</span>
          <span>{bodyTypeLabels[profile.bodyType]}</span>
        </GridData>
      </GridDataSection>

      {/* fitness data */}
      <GridDataSection label="Fitnessdaten">
        <GridData>
          <span data-slot="grid-data-label">Fitness-Ziel</span>
          <span>{fitnessGoalLabels[profile.fitnessGoal]}</span>
        </GridData>
        <GridData>
          <span data-slot="grid-data-label">Aktivitätslevel</span>
          <span>{activityLevelLabels[profile.activityLevel]}</span>
        </GridData>
        <GridData>
          <span data-slot="grid-data-label">Trainingstage</span>
          <span>{profile.trainingDaysPerWeek} / Woche</span>
        </GridData>
      </GridDataSection>

      {/* split data */}
      <GridDataSection label="Makronährwertdaten">
        <GridData>
          <span data-slot="grid-data-label">Makro-Split-Plan</span>
          <span className="italic">{macroSplitLabels[profile.macroSplit].label}</span>
        </GridData>
        <GridData className="gap-x-1 gap-y-2 grid grid-cols-[1fr_auto_auto_auto] grid-rows-4">
          {/* calories */}
          <span data-slot="grid-data-label">Kalorien-Ziel</span>
          <span>
            {calorieGoalMinText}<span className="ml-0.5 text-muted-foreground">kcal</span>
          </span>
          <span className="text-muted-foreground">-</span>
          <span>
            {calorieGoalMaxText}<span className="ml-0.5 text-muted-foreground">kcal</span>
          </span>

          {/* proteins */}
          <span data-slot="grid-data-label" className="text-start">Proteine</span>
          <span className="text-secondary-foreground">
            {proteinsMinText}<span className="ml-0.5 text-muted-foreground">g</span>
          </span>
          <span>-</span>
          <span className="text-secondary-foreground">
            {proteinsMaxText}<span className="ml-0.5 text-muted-foreground">g</span>
          </span>

          {/* fats */}
          <span data-slot="grid-data-label" className="text-start">Fette</span>
          <span className="text-secondary-foreground">
            {fatsMinText}<span className="ml-0.5 text-muted-foreground">g</span>
          </span>
          <span>-</span>
          <span className="text-secondary-foreground">
            {fatsMaxText}<span className="ml-0.5 text-muted-foreground">g</span>
          </span>

          {/* carbs */}
          <span data-slot="grid-data-label" className="text-start">Kohlenhydrate</span>
          <span className="text-secondary-foreground">
            {carbsMinText}<span className="ml-0.5 text-muted-foreground">g</span>
          </span>
          <span>-</span>
          <span className="text-secondary-foreground">
            {carbsMaxText}<span className="ml-0.5 text-muted-foreground">g</span>
          </span>
        </GridData>
      </GridDataSection>

    </CardContent>
  );
}
