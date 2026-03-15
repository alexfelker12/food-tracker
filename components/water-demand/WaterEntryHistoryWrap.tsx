"use client"

import { useRef } from "react";

import { useMutationState } from "@tanstack/react-query";

import { getGermanDate } from "@/lib/utils";

import { HistoryIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

import { WaterEntryHistory } from "./WaterEntryHistory";


export function WaterEntryHistoryWrap() {
  const buttonRef = useRef<HTMLInputElement>(null)

  //* mutation state of any pending water entry action
  const anyActionPending = useMutationState({
    filters: { mutationKey: [["journal", "day", "water"]] },
    select: (mutation) => mutation.state.status === "pending"
  }).at(-1)

  //* today's date
  const dateToday = getGermanDate(new Date())

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="xs"><HistoryIcon /> Verlauf</Button>
      </DrawerTrigger>
      <DrawerContent onOpenAutoFocus={() => buttonRef.current?.focus()}>
        <DrawerHeader>
          <DrawerTitle>Verlauf - {dateToday}</DrawerTitle>
          <DrawerDescription className="sr-only">Siehe hier den Verlauf deines Wasser Trackings und bearbeite oder lösche Einträge</DrawerDescription>
        </DrawerHeader>

        <div className="mx-2 px-2 overflow-y-auto">
          <WaterEntryHistory />
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" disabled={anyActionPending}>Schließen</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
