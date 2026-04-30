"use client"

import { useEffect, useState } from "react";

import { useFormContext } from "react-hook-form";

import { FitnessGoal } from "@/generated/prisma/enums";

import { fitnessGoalLabels } from "@/schemas/labels/profileSchemaLabels";
import { ProfileSchema } from "@/schemas/types";

import { cn } from "@/lib/utils";

import { AlertTriangleIcon, MoreVerticalIcon } from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { NutritionResultDisplay } from "./NutritionResultDisplay";
import { SelectedPlanProps } from "./registry";


export function RecommendedPlan(props: SelectedPlanProps) {
  return (
    <Card className="gap-3 rounded-md">
      <CardHeader className="gap-0">
        <CardTitle className="text-base leading-none">Empfohlene Makronährwerte</CardTitle>
      </CardHeader>
      <CardContent>
        <NutritionResultDisplay {...props} />
        <PlanValidityAlert {...props} />
      </CardContent>
    </Card>
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
