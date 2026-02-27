import { headers } from "next/headers";
import { Suspense } from "react";

import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { CaloryRangeWidget } from "@/components/widgets/CaloryRangeWidget";
import { JournalDayMacros } from "@/components/widgets/JournalDayMacros";
import { WaterDemandWidget } from "@/components/widgets/WaterDemandWidget";
import { DateToday } from "./_components/DateToday";


export default function Page() {
  return (
    <main className="flex p-4 h-full">
      <div className="flex flex-col flex-1 items-center gap-4 [&>section]:w-full">

        <section className="flex justify-between gap-4" aria-description="App Kopfzeile">
          <div className="size-9"></div>
          <h1 className="font-bold text-2xl text-primary" aria-label="Titel">MFoody</h1>
          <ThemeToggle />
        </section>

        <section className="gap-2 grid" aria-description="Startseite - Dashboard Widgets">
          <div role="presentation">
            <div className="flex justify-between items-end gap-4">
              <h2 className="font-semiboldbold text-xl">Heute</h2>

              {/* <div></div> maybe notifications? */}
              <Suspense>
                <DateToday />
              </Suspense>
            </div>

            <Separator />
          </div>

          <Suspense fallback={<Skeleton className="w-full h-[106px]" />}>
            <OpenMacrosWidgetWrap />
          </Suspense>

          <Suspense fallback={<Skeleton className="w-full h-[118px]" />}>
            <CaloryRangeWidgetWrap />
          </Suspense>

          <Suspense fallback={<Skeleton className="w-full h-[96px]" />}>
            <WaterDemandWidgetWrap />
          </Suspense>
        </section>

      </div>
    </main>
  );
}

async function OpenMacrosWidgetWrap() {
  await headers() // read headers to be able to use new Date()

  const date = new Date() // this will be server time, replace for client side solution to use users time

  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.journal.day.getMacros.queryOptions({
    input: { date }
  }))

  return (
    <HydrateClient client={qc}>
      <JournalDayMacros date={date} />
    </HydrateClient>
  )
}

async function CaloryRangeWidgetWrap() {
  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.dashboard.kcalRange.queryOptions())

  return (
    <HydrateClient client={qc}>
      <CaloryRangeWidget />
    </HydrateClient>
  )
}

async function WaterDemandWidgetWrap() {
  await headers()

  const date = new Date()

  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.journal.day.getWaterDemand.queryOptions({
    input: { date }
  }))

  return (
    <HydrateClient client={qc}>
      <WaterDemandWidget date={date} />
    </HydrateClient>
  )
}
