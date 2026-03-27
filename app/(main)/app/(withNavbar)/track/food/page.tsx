import { headers } from "next/headers";
import { Suspense } from "react";

import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

import { RefererContextProvider } from "@/components/RefererContext";

import { BackToJournal } from "./_components/BackToJournal";
import { FoodListingSkeleton } from "./_components/FoodListing";
import { FoodSearch } from "./_components/FoodSearch";
import { FoodTrackingHistory } from "./_components/FoodTrackingHistory";
import { IntakeTimeBadge } from "./_components/IntakeTimeBadge";
import { TrackingDayBadge } from "./_components/TrackingDayBadge";


export default function Page() {
  return (
    <main className="flex justify-center p-4 h-full">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2">

          <div className="flex items-center gap-4">
            <Suspense><BackToJournalWrap /></Suspense>
            <h1 className="font-semibold text-xl">Lebensmittel</h1>
          </div>

          <div className="has-data-intaketime:flex has-data-trackingday:flex justify-end items-center gap-2 hidden">
            <span className="flex-1 text-muted-foreground text-sm">Vorauswahl: </span>
            <Suspense>
              <TrackingDayBadge />
              <IntakeTimeBadge />
            </Suspense>
          </div>

        </div>

        <FoodSearch>
          {/* render as children to enable Suspense loading */}
          <Suspense fallback={<FoodListingSkeleton />}>
            <FoodTrackingHistoryWrap />
          </Suspense>
        </FoodSearch>

      </div>
    </main >
  );
}

async function FoodTrackingHistoryWrap() {
  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.journal.history.listPastWeek.queryOptions())

  return (
    <HydrateClient client={qc}>
      <FoodTrackingHistory />
    </HydrateClient>
  )
}

async function BackToJournalWrap() {
  const referer = (await headers()).get("referer")

  return (
    <RefererContextProvider referer={referer}>
      <BackToJournal />
    </RefererContextProvider>
  );
}
