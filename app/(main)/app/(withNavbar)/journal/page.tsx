import { Suspense } from "react";

import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

import { FullScreenLoader } from "@/components/FullScreenLoader";

import { JournalCalendar } from "./_components/JournalCalendar";


export default function Page() {
  return (
    <main className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-4 w-full">
        <Suspense fallback={<FullScreenLoader />}>
          <PageWrap />
        </Suspense>
      </div>
    </main>
  );
}

async function PageWrap() {
  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.journal.list.queryOptions({ input: {} }))

  return (
    <HydrateClient client={qc}>
      <JournalCalendar />
    </HydrateClient>
  )
}
