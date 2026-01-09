"use client"

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getGermanNumber } from "@/lib/utils";


export function CaloryRangeWidget() {
  const { data } = useSuspenseQuery(orpc.dashboard.kcalRange.queryOptions())

  if (!data) return null;

  const { bmr, caloryGoal, tdee } = data

  const formattedBMR = getGermanNumber(+bmr.toFixed(0))
  const formattedCaloryGoal = getGermanNumber(caloryGoal)
  const formattedTDEE = getGermanNumber(tdee)

  return (
    <Card className="gap-3 py-4 pb-3">
      <CardHeader className="gap-0 px-4">
        <CardTitle className="text-center text-lg leading-none">Kalorienüberblick</CardTitle>
        <CardDescription className="sr-only">Überblick über deine Ruhe-, Erhaltungs und Zielkalorien nach den Angaben in deinem Profil</CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground text-sm">Ruhe-Kalorien:</span>
          <span>{formattedBMR}
            <span className="hidden text-muted-foreground text-sm">kcal</span>
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground text-sm">Momentanes Kalorienziel:</span>
          <span>{formattedCaloryGoal}
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
