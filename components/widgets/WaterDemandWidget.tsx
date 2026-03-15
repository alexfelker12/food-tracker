"use client"

import { useState } from "react";

import { useMutationState, useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";
import { cn, getGermanNumber } from "@/lib/utils";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { AddWaterForm, AddWaterFormBaseProps } from "@/components/water-demand/AddWaterForm";


export type WaterDemandWidgetProps = {
  date: Date
}
export function WaterDemandWidget({ date }: WaterDemandWidgetProps) {
  const { data } = useSuspenseQuery(orpc.journal.day.getWaterDemand.queryOptions({
    input: { date }
  }))

  if (!data.waterDemand) return null;

  const { waterDemand: { waterDemandMin, waterDemandMax }, trackedWater } = data
  const trackedWaterLitres = +(trackedWater / 1000).toFixed(1)

  return (
    <Card size="widget" className="relative">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Tägl. Wasser</CardTitle>
        {/* <CardDescription className="sr-only">Zeigt dein tägliches Bedarf und die bisher aufgenommene Menge an Wasser in Litern an</CardDescription> */}
        <CardAction
        // className="-top-2 -right-1 z-0 absolute"
        >
          <AddWaterFormWrap
            currentAmountMl={trackedWater}
            minAmountMl={waterDemandMin * 1000}
            maxAmountMl={waterDemandMax * 1000}
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <WidgetDataRow label="Untergrenze:" labelValue={waterDemandMin} unit="L" />
        <WidgetDataRow label="Obergrenze:" labelValue={waterDemandMax} unit="L" />
        <WidgetDataRow label="Bisher getrackt:" labelValue={trackedWaterLitres} unit="L" />
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

function AddWaterFormWrap(props: AddWaterFormBaseProps) {
  const [open, setOpen] = useState(false)

  //* mutation state of any pending trackWater action
  const anyActionPending = useMutationState({
    filters: { mutationKey: [["journal", "day", "trackWater"]] },
    select: (mutation) => mutation.state.status === "pending"
  }).at(-1)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="xs"><PlusIcon /> Tracken</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="pb-0">
          <DrawerTitle>Wasser tracken</DrawerTitle>
          <DrawerDescription className="sr-only">Tracke hiermit die Menge deiner konsumierten Flüssigkeit in ml</DrawerDescription>
        </DrawerHeader>
        <AddWaterForm {...props} onSuccessComplete={() => setOpen(false)}>
          <DrawerClose asChild>
            <Button variant="outline" disabled={anyActionPending}>Abbrechen</Button>
          </DrawerClose>
        </AddWaterForm>
      </DrawerContent>
    </Drawer>
  );
}
