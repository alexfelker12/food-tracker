"use client"

import Link from "next/link";
import { useRef, useState } from "react";

import { IntakeTime } from "@/generated/prisma/client";

import { useIntakeTimeParam } from "@/hooks/useIntakeTimeParam";

import { APP_BASE_URL } from "@/lib/constants";

import { ArrowLeftIcon, ScanBarcodeIcon } from "lucide-react";

import { NavbarBarcodeScan } from "@/components/barcode/BarcodeScan";
import { BarcodeScanProvider } from "@/components/barcode/BarcodeScanContext";
import { IntakeTimeOptionLink } from "@/components/journal/IntakeTimeOption";
import { NavbarDrawerIntakeTimeLinks } from "@/components/layout/NavbarDrawerIntakeTimeLinks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { intakeTimeLabels } from "@/schemas/labels/journalEntrySchemaLabels";


interface FoodTrackMenuProps {
  preselectedIntakeTime?: IntakeTime
  children?: React.ReactNode
}
export function FoodTrackMenu({ preselectedIntakeTime, children }: FoodTrackMenuProps) {
  const [open, setOpen] = useState(false)
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const nestedFirstButtonRef = useRef<HTMLButtonElement>(null)
  const { intakeTimeKey } = useIntakeTimeParam()

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>

      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
        <DrawerHeader>
          <DrawerTitle className="text-lg">
            <span>Tracken</span>
            {preselectedIntakeTime && (
              <Badge className="bg-accent ml-2 text-accent-foreground text-sm">
                {intakeTimeLabels[preselectedIntakeTime]}
              </Badge>
            )}
          </DrawerTitle>
          <DrawerDescription className="text-base sr-only">Finde Lebensmittel und Mahlzeiten per Suche oder mit dem Barcode-Scanner</DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="pt-0">

          <NavbarBarcodeScanDrawer
            closeMainDrawer={() => setOpen(false)}
            preselectedIntakeTime={preselectedIntakeTime}
          >
            <Button variant="outline" className="flex-1" ref={firstButtonRef}>
              <ScanBarcodeIcon /> Per Barcode finden
            </Button>
          </NavbarBarcodeScanDrawer>

          {preselectedIntakeTime
            ?
            <DrawerClose asChild>
              <IntakeTimeOptionLink
                label="Lebensmittel"
                href={`${APP_BASE_URL}/track/food?${intakeTimeKey}=${preselectedIntakeTime}`}
              />
            </DrawerClose>
            :
            <NestedDrawer>
              <DrawerTrigger className="flex-1" asChild>
                <Button variant="outline">Lebensmittel</Button>
              </DrawerTrigger>
              <DrawerContent onOpenAutoFocus={() => nestedFirstButtonRef.current?.focus()}>
                <DrawerHeader>
                  <DrawerTitle className="text-lg">Lebensmittel tracken für...</DrawerTitle>
                  <DrawerDescription className="text-base">Wähle eine Tageszeit, zu der ein Lebensmittel getrackt werden soll</DrawerDescription>
                </DrawerHeader>

                <NavbarDrawerIntakeTimeLinks
                  href={APP_BASE_URL + "/track/food"}
                  ref={nestedFirstButtonRef}
                  onOptionClick={() => setOpen(false)}
                />

                <div className="px-4 w-full"><Separator /></div>

                <DrawerFooter className="flex-col-reverse">
                  <DrawerClose asChild>
                    <Button variant="outline" className="flex-1"><ArrowLeftIcon /> Zurück</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </NestedDrawer>
          }

          <DrawerClose asChild>
            <Button asChild variant="outline">
              <Link href={APP_BASE_URL + "/track/meal"}>Mahlzeit</Link>
            </Button>
          </DrawerClose>

        </DrawerFooter>
      </DrawerContent>
    </Drawer >
  )
}

interface NavbarBarcodeScanDrawerProps extends Pick<FoodTrackMenuProps, "preselectedIntakeTime"> {
  closeMainDrawer: () => void
  children?: React.ReactNode
}
function NavbarBarcodeScanDrawer({ closeMainDrawer, preselectedIntakeTime, children }: NavbarBarcodeScanDrawerProps) {
  const [open, setOpen] = useState(false)
  const [barcode, setBarcode] = useState("")
  const [lastBarcode, setLastBarcode] = useState("")
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const { intakeTimeKey } = useIntakeTimeParam()

  return (
    <NestedDrawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children}

      </DrawerTrigger>
      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>

        <DrawerHeader>
          <DrawerTitle className="text-lg">Barcode scannen</DrawerTitle>
          <DrawerDescription className="text-base sr-only">Scanne den Barcode eines Produkts, um es in der Datenbank zu finden, falls es bereits erstellt ist</DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="gap-4 pt-0">
          <BarcodeScanProvider
            barcode={barcode}
            setBarcode={setBarcode}
            lastBarcode={lastBarcode}
            setLastBarcode={setLastBarcode}
            closeNestedDrawer={() => setOpen(false)}
            closeMainDrawer={closeMainDrawer}
            enabled={open}
            urlSuffix={`?${intakeTimeKey}=${preselectedIntakeTime}`}
          >
            <NavbarBarcodeScan />
          </BarcodeScanProvider>

          <Separator />

          <DrawerClose asChild>
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => {
                setBarcode("")
                setLastBarcode("")
              }}
              ref={firstButtonRef}
            ><ArrowLeftIcon /> Zurück</Button>
          </DrawerClose>
        </DrawerFooter>

      </DrawerContent>
    </NestedDrawer>
  );
}
