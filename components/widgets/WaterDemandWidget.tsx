"use client"

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getGermanNumber } from "@/lib/utils";

export type WaterDemandWidgetProps = {
  date: Date
}
export function WaterDemandWidget({ date }: WaterDemandWidgetProps) {
  const { data } = useSuspenseQuery(orpc.journal.day.getWaterDemand.queryOptions({
    input: { date }
  }))

  if (!data) return null;

  const { waterDemandMin, waterDemandMax } = data

  // TODO: adjust rendered html and add incr/decr functionality when water demand structure gets added

  return (
    <Card size="widget">
      <CardHeader>
        <CardTitle>Tägliches Wasser</CardTitle>
        <CardDescription className="sr-only">Zeigt dein tägliches Bedarf und die bisher aufgenommene Menge an Wasser in Litern an</CardDescription>
      </CardHeader>
      <CardContent>
        <WidgetDataRow label="Untergrenze:" labelValue={waterDemandMin} unit="L" />
        <WidgetDataRow label="Obergrenze:" labelValue={waterDemandMax} unit="L" />
      </CardContent>
    </Card>
  );
}

function WidgetDataRow({ label, labelValue, unit, className, ...props }: React.ComponentProps<"div"> & {
  label: string
  labelValue: number
  unit: string
}) {
  const formattedValue = getGermanNumber(labelValue, 1)
  return (
    <div className={cn("flex justify-between gap-2", className)} {...props}>
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex items-center gap-1">
        <span>{formattedValue}</span>
        <span className="text-muted-foreground text-sm">{unit}</span>
      </div>
    </div>
  );
}
