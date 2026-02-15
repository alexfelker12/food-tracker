"use client"

import { activityLevelLabels, bodyTypeLabels, fitnessGoalLabels, genderLabels } from "@/schemas/labels/profileSchemaLabels";

import { getGermanDate } from "@/lib/utils";

import { GridData, GridDataSection } from "@/components/GridData";
import { CardContent } from "@/components/ui/card";

import { useUserProfile } from "./UserProfileContext";


export function UserProfileData() {
  const { profile } = useUserProfile()

  const birthDate = getGermanDate(profile.birthDate)

  return (
    <CardContent className="space-y-6 px-0">

      {/* user data */}
      <GridDataSection label="Benutzerdaten">
        <GridData>
          <span>Geschlecht</span>
          <span>{genderLabels[profile.gender]}</span>
        </GridData>
        <GridData>
          <span>Geburtsdatum</span>
          <span>{birthDate}</span>
        </GridData>
      </GridDataSection>

      {/* body data */}
      <GridDataSection label="Körperdaten">
        <GridData>
          <span>Größe</span>
          <span>{profile.heightCm} cm</span>
        </GridData>
        <GridData>
          <span>Gewicht</span>
          <span>{profile.weightKg} kg</span>
        </GridData>
        <GridData>
          <span>Körpertyp</span>
          <span>{bodyTypeLabels[profile.bodyType]}</span>
        </GridData>
      </GridDataSection>

      {/* fitness data */}
      <GridDataSection label="Fitnessdaten">
        <GridData>
          <span>Fitness-Ziel</span>
          <span>{fitnessGoalLabels[profile.fitnessGoal]}</span>
        </GridData>
        <GridData>
          <span>Aktivitätslevel</span>
          <span>{activityLevelLabels[profile.activityLevel]}</span>
        </GridData>
        <GridData>
          <span>Trainingstage</span>
          <span>{profile.trainingDaysPerWeek} / Woche</span>
        </GridData>
      </GridDataSection>

      {/* split data */}
      <GridDataSection label="Makronährwertdaten">
        <GridData>
          <span>Nutzt empfohlene Verteilung?</span>
          <span>{profile.nutritionResult.usedRecommendedSplits ? "Ja" : "Nein"}</span>
        </GridData>
        {/* split percent from profile & absolute from nutrition result */}
        <GridData className="gap-2 grid grid-cols-[1fr_auto_auto_auto] grid-row-3 text-end text-muted-foreground">
          <span className="text-start">Fette</span>
          <span>{profile.fatSplit} %</span>
          <span>-</span>
          <span className="text-secondary-foreground">{profile.nutritionResult.amountFats}g</span>

          <span className="text-start">Kohlenhydrate</span>
          <span>{profile.carbSplit} %</span>
          <span>-</span>
          <span className="text-secondary-foreground">{profile.nutritionResult.amountCarbs}g</span>

          <span className="text-start">Proteine</span>
          <span>{profile.proteinSplit} %</span>
          <span>-</span>
          <span className="text-secondary-foreground">{profile.nutritionResult.amountProtein}g</span>
        </GridData>
      </GridDataSection>

    </CardContent>
  );
}
