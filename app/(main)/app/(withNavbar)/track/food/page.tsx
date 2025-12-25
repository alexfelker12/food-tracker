import { Suspense } from "react";

import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

import { FoodListingSkeleton } from "./_components/FoodListing";
import { FoodSearch } from "./_components/FoodSearch";
import { FoodTrackingHistory } from "./_components/FoodTrackingHistory";
import { CurrentPreselection } from "./_components/CurrentPreselection";


export default function Page() {
  return (
    <main className="flex justify-center p-4 h-full">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex justify-between">
          <h1 className="font-semibold text-xl">Lebesmittel tracken</h1>

          <Suspense>
            <CurrentPreselection />
          </Suspense>
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
