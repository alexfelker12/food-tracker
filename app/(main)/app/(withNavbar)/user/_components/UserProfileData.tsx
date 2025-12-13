"use client"

import { activityLevelLabels, bodyTypeLabels, fitnessGoalLabels, genderLabels } from "@/schemas/labels/profileSchemaLabels";

import { getGermanDate } from "@/lib/utils";

import { CardContent } from "@/components/ui/card";

import { useUserProfile } from "./UserProfileContext";
import { ProfileData, ProfileDataSection } from "./UserProfileView";


export function UserProfileData() {
  const { profile } = useUserProfile()

  const birthDate = getGermanDate(profile.birthDate)

  return (
    <CardContent className="space-y-6 px-4">

      {/* user data */}
      <ProfileDataSection label="Benutzerdaten">
        <ProfileData>
          <span>Geschlecht</span>
          <span>{genderLabels[profile.gender]}</span>
        </ProfileData>
        <ProfileData>
          <span>Geburtsdatum</span>
          <span>{birthDate}</span>
        </ProfileData>
      </ProfileDataSection>

      {/* body data */}
      <ProfileDataSection label="Körperdaten">
        <ProfileData>
          <span>Größe</span>
          <span>{profile.heightCm} cm</span>
        </ProfileData>
        <ProfileData>
          <span>Gewicht</span>
          <span>{profile.weightKg} kg</span>
        </ProfileData>
        <ProfileData>
          <span>Körpertyp</span>
          <span>{bodyTypeLabels[profile.bodyType]}</span>
        </ProfileData>
      </ProfileDataSection>

      {/* fitness data */}
      <ProfileDataSection label="Fitnessdaten">
        <ProfileData>
          <span>Fitness-Ziel</span>
          <span>{fitnessGoalLabels[profile.fitnessGoal]}</span>
        </ProfileData>
        <ProfileData>
          <span>Aktivitätslevel</span>
          <span>{activityLevelLabels[profile.activityLevel]}</span>
        </ProfileData>
        <ProfileData>
          <span>Trainingstage</span>
          <span>{profile.trainingDaysPerWeek} / Woche</span>
        </ProfileData>
      </ProfileDataSection>

      {/* split data */}
      <ProfileDataSection label="Makronährwertdaten">
        <ProfileData>
          <span>Nutzt empfohlene Verteilung?</span>
          <span>{profile.nutritionResult.usedRecommendedSplits ? "Ja" : "Nein"}</span>
        </ProfileData>
        {/* split percent from profile & absolute from nutrition result */}
        <ProfileData className="gap-2 grid grid-cols-[1fr_auto_auto_auto] grid-row-3 text-end">
          <span className="text-muted-foreground text-start">Fette</span>
          <span>{profile.fatSplit} %</span>
          <span className="text-muted-foreground">-</span>
          <span>{profile.nutritionResult.amountFats}g</span>

          <span className="text-muted-foreground text-start">Kohlenhydrate</span>
          <span>{profile.carbSplit} %</span>
          <span className="text-muted-foreground">-</span>
          <span>{profile.nutritionResult.amountCarbs}g</span>

          <span className="text-muted-foreground text-start">Proteine</span>
          <span>{profile.proteinSplit} %</span>
          <span className="text-muted-foreground">-</span>
          <span>{profile.nutritionResult.amountProtein}g</span>
        </ProfileData>
      </ProfileDataSection>

    </CardContent>
  );
}
