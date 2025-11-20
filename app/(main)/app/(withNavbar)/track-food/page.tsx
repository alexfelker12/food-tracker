import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { TestORPCListing } from "./_components/TestORPCListing";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  return (
    <main className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-4">
        <span>Track food</span>
        <Suspense fallback={<Loader />}>
          <TestORPC />
        </Suspense>
      </div>
    </main>
  );
}

async function TestORPC() {
  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.test.list.queryOptions())

  return (
    <HydrateClient client={qc}>
      <TestORPCListing />
    </HydrateClient>
  )
}

function Loader() {
  return (
    <div className="place-items-center grid size-full">
      <Spinner className="size-6" />
    </div>
  );
}