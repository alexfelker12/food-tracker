"use client"

import Link from "next/link";
import { useRef, useState } from "react";

import { intakeTimeLabels } from "@/schemas/labels/journalEntrySchemaLabels";

import { IntakeTime } from "@/generated/prisma/client";

import { useIntakeTimeParam } from "@/hooks/useIntakeTimeParam";
import { useTrackingDayParam } from "@/hooks/useTrackingDayParam";

import { APP_BASE_URL } from "@/lib/constants";
import { get_yyyymmdd_date, getGermanDate } from "@/lib/utils";

import { ArrowLeftIcon, ScanBarcodeIcon } from "lucide-react";

import { NavbarBarcodeScan } from "@/components/barcode/BarcodeScan";
import { BarcodeScanProvider } from "@/components/barcode/BarcodeScanContext";
import { IntakeTimeOptionLink } from "@/components/journal/IntakeTimeOption";
import { NavbarDrawerIntakeTimeLinks } from "@/components/layout/NavbarDrawerIntakeTimeLinks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";


interface FoodTrackMenuProps {
  preselectedIntakeTime?: IntakeTime
  preselectedTrackingDay?: Date
  children?: React.ReactNode
}
export function FoodTrackMenu({ preselectedIntakeTime, preselectedTrackingDay, children }: FoodTrackMenuProps) {
  const [open, setOpen] = useState(false)
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const nestedFirstButtonRef = useRef<HTMLButtonElement>(null)
  const { intakeTimeKey } = useIntakeTimeParam()
  const { trackingDayKey } = useTrackingDayParam()
  const trackingDayString = preselectedTrackingDay ? get_yyyymmdd_date(preselectedTrackingDay) : ""
  const germanDate = preselectedTrackingDay ? getGermanDate(preselectedTrackingDay) : ""

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>

      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
        <DrawerHeader>
          <DrawerTitle className="text-lg">Tracken</DrawerTitle>
          <DrawerDescription className="space-x-1.5">
            {preselectedTrackingDay && <Badge variant="secondary" className="text-sm">{germanDate}</Badge>}
            {preselectedIntakeTime && (
              <Badge className="bg-accent text-accent-foreground text-sm">
                {intakeTimeLabels[preselectedIntakeTime]}
              </Badge>
            )}
            <span className="text-base sr-only">Finde Lebensmittel und Mahlzeiten per Suche oder mit dem Barcode-Scanner</span>
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="pt-0">

          <NavbarBarcodeScanDrawer
            closeMainDrawer={() => setOpen(false)}
            preselectedIntakeTime={preselectedIntakeTime}
            preselectedTrackingDay={preselectedTrackingDay}
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
                href={`${APP_BASE_URL}/track/food?${intakeTimeKey}=${preselectedIntakeTime}&${trackingDayKey}=${trackingDayString}`}
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

interface NavbarBarcodeScanDrawerProps extends Pick<FoodTrackMenuProps, "preselectedIntakeTime" | "preselectedTrackingDay"> {
  closeMainDrawer: () => void
  children?: React.ReactNode
}
export function NavbarBarcodeScanDrawer({ closeMainDrawer, preselectedIntakeTime, preselectedTrackingDay, children }: NavbarBarcodeScanDrawerProps) {
  const [open, setOpen] = useState(false)
  const [barcode, setBarcode] = useState("")
  const [lastBarcode, setLastBarcode] = useState("")
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const { intakeTime, intakeTimeKey } = useIntakeTimeParam()
  const { trackingDay, trackingDayKey } = useTrackingDayParam()
  const time = preselectedIntakeTime || intakeTime
  const day = preselectedTrackingDay || trackingDay

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
            urlSuffix={`?${intakeTimeKey}=${time}&${trackingDayKey}=${day}`}
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
