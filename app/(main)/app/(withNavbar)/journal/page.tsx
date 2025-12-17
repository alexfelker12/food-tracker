import { Suspense } from "react";

import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

import { FullScreenLoader } from "@/components/FullScreenLoader";

import { JournalCalendarView } from "./_components/JournalCalendarView";


export default function Page() {
  return (
    <main className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-4 p-4 w-full">
        <Suspense fallback={<FullScreenLoader />}>
          <PageWrap />
        </Suspense>
      </div>
    </main>
  );
}

async function PageWrap() {
  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.journal.list.queryOptions())

  return (
    <HydrateClient client={qc}>
      <JournalCalendarView />
    </HydrateClient>
  )
}
