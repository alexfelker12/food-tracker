import { Suspense } from "react";

import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

import { FullScreenLoader } from "@/components/FullScreenLoader";
import { UserProfile } from "./_components/UserProfile";


export default function Page() {
  return (
    <main className="flex justify-center items-center p-4 h-full">
      <div className="flex flex-col flex-1 items-center gap-4 h-full">
        <Suspense fallback={<FullScreenLoader />}>
          <PageWrap />
        </Suspense>
      </div>
    </main>
  );
}

async function PageWrap() {
  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.profile.get.queryOptions())

  return (
    <HydrateClient client={qc}>
      <UserProfile />
    </HydrateClient>
  )
}
