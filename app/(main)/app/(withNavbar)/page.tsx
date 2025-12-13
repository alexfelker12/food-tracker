import { headers } from "next/headers";
import { Suspense } from "react";

import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { JournalDayMacros } from "./journal/[journalDayDate]/_components/JournalDayMacros"; // move to @/components?


export default function Page() {
  return (
    <main className="flex p-4 h-full">
      <div className="flex flex-col flex-1 items-center gap-4 [&>section]:w-full">

        <section className="flex justify-between gap-4" aria-description="App Kopfzeile">
          <div></div>
          <h1 className="font-bold text-2xl text-primary" aria-label="Titel">MFoody</h1>
          <div></div>
        </section>

        <section className="gap-2 grid" aria-description="Startseite - Dashboard Widgets">
          <div role="presentation">
            <div className="flex justify-between gap-4">
              <h2 className="font-semiboldbold text-xl">Heute</h2>

              {/* <div></div> maybe notifications? */}
              <div></div>
            </div>

            <Separator />
          </div>

          <Suspense fallback={<Skeleton className="w-full h-[110px]" />}>
            <OpenMacrosWidgetWrap />
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
