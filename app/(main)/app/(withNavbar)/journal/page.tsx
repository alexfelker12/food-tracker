import { Suspense } from "react";

import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

import { FullScreenLoader } from "@/components/FullScreenLoader";

import { JournalCalendarView } from "./_components/JournalCalendarView";


export default function Page() {
  return (
    <main className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-6 p-4 size-full">
        <div className="space-y-1">
          <h1 className="font-semibold text-xl">Tagebuch</h1>
          <p className="text-muted-foreground text-sm">Dies ist eine Übersicht deiner tracking Tage. Sie soll dir auf einen Blick die Tage kennzeichnen, an denen du Kalorien getrackt hast</p>
        </div>

        <div className="flex flex-1 items-center w-full">
          <Suspense fallback={<FullScreenLoader />}>
            <PageWrap />
          </Suspense>
        </div>
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
