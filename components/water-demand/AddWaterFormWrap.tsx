"use client"

import { useState } from "react";

import { useMutationState } from "@tanstack/react-query";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { AddWaterForm, AddWaterFormBaseProps } from "@/components/water-demand/AddWaterForm";


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

export {
  AddWaterFormWrap
}
