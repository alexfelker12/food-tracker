"use client"

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getGermanNumber } from "@/lib/utils";


export function CaloryRangeWidget() {
  const { data } = useSuspenseQuery(orpc.dashboard.kcalRange.queryOptions())

  if (!data) return null;

  const { bmr, calorieGoalTarget, tdee } = data

  const formattedBMR = getGermanNumber(bmr, 0)
  const formattedCalorcalorieGoalTarget = getGermanNumber(calorieGoalTarget, 0)
  const formattedTDEE = getGermanNumber(tdee, 0)

  return (
    <Card size="widget">
      <CardHeader>
        <CardTitle>Kalorienüberblick</CardTitle>
        <CardDescription className="sr-only">Überblick über deine Ruhe-, Erhaltungs und Zielkalorien nach den Angaben in deinem Profil</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground text-sm">Ruhe-Kalorien:</span>
          <span>{formattedBMR}
            <span className="hidden text-muted-foreground text-sm">kcal</span>
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground text-sm">Momentanes Kalorienziel:</span>
          <span>{formattedCalorcalorieGoalTarget}
            <span className="hidden text-muted-foreground text-sm">kcal</span>
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground text-sm">Erhaltungs-Kalorien:</span>
          <span>{formattedTDEE}
            <span className="hidden text-muted-foreground text-sm">kcal</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
