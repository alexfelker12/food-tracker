import { Suspense } from "react";

import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

import { FoodListingSkeleton } from "./_components/FoodListing";
import { FoodSearch } from "./_components/FoodSearch";
import { FoodTrackingHistory } from "./_components/FoodTrackingHistory";


export default function Page() {
  return (
    <main className="flex justify-center p-4 h-full">
      <div className="flex flex-col gap-6 w-full">
        <div className="space-y-1">
          <h1 className="font-semibold text-xl">Lebesmittel tracken</h1>
          {/* <p className="text-muted-foreground text-sm">Suche nach einem Lebensmittel und klicke auf das "+" um dieses zu deinem Tagebuch hinzuzufügen</p> */}
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
