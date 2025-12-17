"use client"

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";
import { cn, getGermanNumber } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


export type JournalDayMacrosProps = {
  date: Date
}
export function JournalDayMacros({ date }: JournalDayMacrosProps) {
  const { data: { openMacros } } = useSuspenseQuery(orpc.journal.day.getMacros.queryOptions({
    input: { date }
  }))

  const openKcal = openMacros.kcal === 0 ? "-" : getGermanNumber(openMacros.kcal)
  const openFats = openMacros.fats === 0 ? "-" : getGermanNumber(openMacros.fats)
  const openCarbs = openMacros.carbs === 0 ? "-" : getGermanNumber(openMacros.carbs)
  const openProteins = openMacros.proteins === 0 ? "-" : getGermanNumber(openMacros.proteins)

  return (
    <Card className="gap-3 py-4 pb-3">
      <CardHeader className="gap-0 px-4">
        <CardTitle className="text-center text-lg leading-none">Offene Nährwerte</CardTitle>
        <CardDescription className="sr-only">Zeigt die offenen Kalorien und Makrowerte für diesen Tag an</CardDescription>
        {/* <CardAction>
          <Button asChild variant="outline" size="icon">
            <Link href={APP_BASE_URL + "/track"}>
              <PlusIcon /><span className="sr-only">Lebensmittel tracken</span>
            </Link>
          </Button>
        </CardAction> */}
      </CardHeader>
      <CardContent className="px-2">
        <div className="flex justify-between items-center gap-2 h-11 leading-none">

          <div className="flex flex-col items-center gap-1 min-w-16 text-center text-lg leading-none">
            <span className="text-muted-foreground text-sm">Kalorien</span>
            <span>{openKcal}</span>
          </div>

          <Separator orientation="vertical" className="h-4/5!" />

          <div className="flex flex-1 items-center gap-1 h-full">
            <div className="flex flex-col flex-1 gap-1 text-center">
              <span className="text-muted-foreground text-xs">Kohlenhydrate</span>
              <span>{openCarbs} <span className={cn(
                "text-muted-foreground text-xs",
                openMacros.carbs === 0 && "hidden"
              )}>g</span></span>
            </div>

            <div className="flex flex-col flex-1 gap-1 text-center">
              <span className="text-muted-foreground text-xs">Fette</span>
              <span>{openFats} <span className={cn(
                "text-muted-foreground text-xs",
                openMacros.fats === 0 && "hidden"
              )}>g</span></span>
            </div>

            <div className="flex flex-col flex-1 gap-1 text-center">
              <span className="text-muted-foreground text-xs">Proteine</span>
              <span>{openProteins} <span className={cn(
                "text-muted-foreground text-xs",
                openMacros.proteins === 0 && "hidden"
              )}>g</span></span>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
