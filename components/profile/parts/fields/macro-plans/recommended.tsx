"use client"

import { useEffect, useState } from "react";

import { useFormContext } from "react-hook-form";

import { FitnessGoal } from "@/generated/prisma/enums";

import { fitnessGoalLabels } from "@/schemas/labels/profileSchemaLabels";
import { ProfileSchema } from "@/schemas/types";

import { cn, getGermanNumber } from "@/lib/utils";

import { AlertTriangleIcon, MoreVerticalIcon } from "lucide-react";

import { GridData, GridDataSection } from "@/components/GridData";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { SelectedPlanProps } from "./registry";


export function RecommendedPlan(props: SelectedPlanProps) {
  return (
    <div className="space-y-4">
      <NutritionResultDisplay {...props} />
      <PlanValidityAlert {...props} />
    </div>
  );
}

function NutritionResultDisplay({ nutritionResult }: SelectedPlanProps) {
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
    <GridDataSection label="Kalorien-Ziel & Makronährwert-Bereich">

      {/* calorieGoal */}
      <GridData className="gap-x-1 gap-y-2 grid grid-cols-[1fr_auto_auto_auto] grid-row-4">
        <span data-slot="grid-data-label">Kalorien-Ziel</span>
        <span>{calorieGoalMinText}<span className="ml-0.5 text-muted-foreground">kcal</span></span>
        <span className="text-muted-foreground">-</span>
        <span>{calorieGoalMaxText}<span className="ml-0.5 text-muted-foreground">kcal</span></span>
        {/* </GridData>

      <GridData className="gap-2 gap-x-1 grid grid-cols-[1fr_auto_auto_auto] grid-row-3"> */}
        {/* proteins */}
        <span data-slot="grid-data-label">Proteine</span>
        <span>{proteinsMin}<span className="ml-0.5 text-muted-foreground">g</span></span>
        <span className="text-muted-foreground">-</span>
        <span>{proteinsMax}<span className="ml-0.5 text-muted-foreground">g</span></span>

        {/* fats */}
        <span data-slot="grid-data-label">Fette</span>
        <span>{fatsMin}<span className="ml-0.5 text-muted-foreground">g</span></span>
        <span className="text-muted-foreground">-</span>
        <span>{fatsMax}<span className="ml-0.5 text-muted-foreground">g</span></span>

        {/* carbs*/}
        <span data-slot="grid-data-label">Carbs</span>
        <span>{carbsMin}<span className="ml-0.5 text-muted-foreground">g</span></span>
        <span className="text-muted-foreground">-</span>
        <span>{carbsMax}<span className="ml-0.5 text-muted-foreground">g</span></span>
      </GridData>

    </GridDataSection>
  );
}

function PlanValidityAlert({ planValidity, nutritionResult }: SelectedPlanProps) {
  const { setValue, getValues } = useFormContext<ProfileSchema>();
  const fitnessGoal = getValues("fitnessProfileStep.fitnessGoal")
  const [healthierPlan, setHealthierPlan] = useState<FitnessGoal>(fitnessGoal)
  const [alertDismissed, setAlertDismissed] = useState(false)

  // update healthier plan when nutritionResult changes
  useEffect(() => {
    switch (fitnessGoal) {
      case "QUICKLY_LOSE_WEIGHT":
        setHealthierPlan("LOSE_WEIGHT")
        break;
      case "QUICKLY_GAIN_WEIGHT":
        setHealthierPlan("GAIN_WEIGHT")
        break;
    }
  }, [nutritionResult])

  // renable alert when fitnessGoal changes
  useEffect(() => { setAlertDismissed(false) }, [fitnessGoal])

  // mapped labels
  const fitnessGoalText = fitnessGoalLabels[fitnessGoal]
  const healthierPlanText = fitnessGoalLabels[healthierPlan]

  // update fitness goal in case plan is invalid
  const handleFitnessGoalChange = () => {
    switch (fitnessGoal) {
      case "QUICKLY_LOSE_WEIGHT":
        setValue("fitnessProfileStep.fitnessGoal", "LOSE_WEIGHT")
        break;
      case "QUICKLY_GAIN_WEIGHT":
        setValue("fitnessProfileStep.fitnessGoal", "GAIN_WEIGHT")
        break;
    }
  }

  if (!planValidity.isPlanValid && !alertDismissed) return (
    <Alert
      className={cn(
        "pr-12!",
        "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-900 text-yellow-900 dark:text-yellow-50"
      )}
    >
      <AlertTriangleIcon />
      <AlertTitle>Achtung</AlertTitle>
      <AlertDescription className="text-wrap">
        Dein Fitness-Ziel <strong className="text-foreground/90 text-nowrap">{fitnessGoalText}</strong> ist mit deinen Angaben leider nicht Gesund einhaltbar
      </AlertDescription>
      <AlertAction className="top-1 right-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreVerticalIcon /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setAlertDismissed(true)}>
                Meldung ignorieren
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleFitnessGoalChange}>
                <span>Auf <strong>{healthierPlanText}</strong> stellen</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </AlertAction>
    </Alert>
  );

  return null
}
