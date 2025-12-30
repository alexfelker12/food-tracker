"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { BarcodeResultFoods } from '@/orpc/router/food/getByBarcode';

import { APP_BASE_URL } from '@/lib/constants';
import { orpc } from '@/lib/orpc';
import { cn } from "@/lib/utils";

import { BarcodeIcon, RotateCcwIcon, ScanLineIcon, XIcon } from "lucide-react";

import { BarcodeScanner } from '@/components/BarcodeScanner';
import NoPrefetchLink from "@/components/NoPrefetchLink";
import { Button } from '@/components/ui/button';
import { DrawerClose } from "@/components/ui/drawer";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ItemGroup } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';

import { FoodListingItem } from '@/app/(main)/app/(withNavbar)/track/food/_components/FoodListingItem';
import { useBarcodeScan } from './BarcodeScanContext';


export function NavbarBarcodeScan() {
  const { enabled, barcode, lastBarcode, setBarcode, setLastBarcode } = useBarcodeScan()
  const isScanned = barcode.length > 0

  return (
    <div className="flex flex-col gap-y-2">
      <h4 className="relative flex justify-between items-center h-8 text-muted-foreground">
        <span className={cn(
          "top-1/2 left-0 absolute opacity-100 w-full transition-[opacity,scale] -translate-y-1/2 duration-150 pointer-events-none scale-y-100",
          isScanned && "opacity-0 scale-y-50"
        )}>
          Halte den Barcode im markierten Bereich
        </span>
        <span className={cn(
          "opacity-0 transition-[opacity,scale] duration-150 scale-y-50",
          isScanned && "opacity-100 scale-y-100"
        )}>
          Ergebnisse für <span className="text-foreground italic">{lastBarcode}</span>
        </span>

        <Button
          className={cn(
            "opacity-0! text-foreground transition-opacity duration-150 pointer-events-none",
            isScanned && "opacity-100! pointer-events-auto"
          )}
          variant="outline"
          size="icon-sm"
          onClick={() => setBarcode("")}
          disabled={!isScanned}
        >
          <XIcon />
        </Button>
      </h4>

      {/* max-h-[min(calc(100vw-var(--spacing)*8),var(--container-md))] */}
      <div className="-mx-2 px-2 transition-[height] overflow-y-scroll aspect-square barcode-wrap">
        {isScanned
          ? <BarcodeScanResults />
          : enabled
            ? <BarcodeScanner
              onDetected={(results) => {
                const barcode = results[0].rawValue
                setBarcode(barcode)
                setLastBarcode(barcode)
                // if (results.length === 1) {
                // } else { handle multiple scanned? ... }
              }}
            />
            : null
        }
      </div>
    </div>
  );
}


function BarcodeScanResults() {
  const { barcode } = useBarcodeScan()
  const { data, isFetching, isEnabled } = useQuery(orpc.food.getByBarcode.queryOptions({
    input: { barcode },
    enabled: barcode.length > 0
  }))

  // w-full h-[min(calc(100vw-var(--spacing)*8),var(--container-md))]
  if (isFetching) return <div className="place-items-center grid size-full">
    <Spinner className="text-primary size-8" />
  </div>

  if (isEnabled && data) return (
    <BarcodeScanResultsListing matches={data} />
  );
}

function BarcodeScanResultsListing({
  matches }: {
    matches: BarcodeResultFoods
  }
) {
  const { closeNestedDrawer, closeMainDrawer } = useBarcodeScan()
  const { push } = useRouter()

  useEffect(() => {
    if (matches.length === 1) {
      push(APP_BASE_URL + `/track/food/${matches[0].id}`) // ?barcode=${barcode}
      closeNestedDrawer()
      closeMainDrawer()
    }
  }, [matches.length])

  if (matches.length === 0) return <BarcodeScanNoResults />

  if (matches.length > 1) return (
    <ItemGroup className="gap-1.5 h-full">
      {matches.map((food) => (
        <FoodListingItem key={food.id} food={food} />
      ))}
    </ItemGroup>
  );
}

function BarcodeScanNoResults() {
  const { barcode, setBarcode, closeMainDrawer } = useBarcodeScan()

  return (
    <Empty className="border h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ScanLineIcon />
        </EmptyMedia>
        <EmptyTitle>Barcode nicht gefunden</EmptyTitle>
        <EmptyDescription>
          Versuche es erneut oder erstelle ein Lebensmittel mit dem gescanten Barcode
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={() => setBarcode("")}>
            <RotateCcwIcon /> Erneut versuchen
          </Button>
          <DrawerClose asChild>
            <Button onClick={closeMainDrawer} asChild>
              <NoPrefetchLink href={APP_BASE_URL + `/create/food?barcode=${barcode}`}>
                <BarcodeIcon /> Mit Barcode erstellen
              </NoPrefetchLink>
            </Button>
          </DrawerClose>
        </div>
      </EmptyContent>
    </Empty>
  );
}
