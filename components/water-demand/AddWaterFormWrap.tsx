"use client"

import { useState } from "react";

import { useMutationState } from "@tanstack/react-query";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { AddWaterForm } from "@/components/water-demand/AddWaterForm";
import { Separator } from "@/components/ui/separator";


interface AddWaterFormWrapProps {
  currentAmountMl: number
  minAmountMl: number
  maxAmountMl: number
}
export function AddWaterFormWrap(props: AddWaterFormWrapProps) {
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

        <CurrentWaterGoal {...props} />

        <AddWaterForm onSuccessComplete={() => setOpen(false)}>
          <DrawerClose asChild>
            <Button variant="outline" disabled={anyActionPending}>Abbrechen</Button>
          </DrawerClose>
        </AddWaterForm>
      </DrawerContent>
    </Drawer>
  );
}

export function CurrentWaterGoal({ currentAmountMl, minAmountMl, maxAmountMl }: AddWaterFormWrapProps) {
  // formatted text/state
  const minGoalMl = +(minAmountMl).toFixed(0)
  const maxGoalMl = +(maxAmountMl).toFixed(0)
  const minAmountLeftMl = +(minAmountMl - currentAmountMl).toFixed(0)
  const maxAmountLeftMl = +(maxAmountMl - currentAmountMl).toFixed(0)

  return (
    <div className="flex flex-col gap-4 p-4 pb-0">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-sm">
          <span>Tages-Ziel:</span>
          <span>
            {minGoalMl} <span className="text-muted-foreground">ml</span> - {" "}
            {maxGoalMl} <span className="text-muted-foreground">ml</span>
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span>Noch übrig:</span>
          <span>
            {minAmountLeftMl} <span className="text-muted-foreground">ml</span> - {" "}
            {maxAmountLeftMl} <span className="text-muted-foreground">ml</span>
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span>Bisher getrackt:</span>
          <span>{currentAmountMl} <span className="text-muted-foreground">ml</span></span>
        </div>
      </div>

      <Separator />
    </div>
  );
}
