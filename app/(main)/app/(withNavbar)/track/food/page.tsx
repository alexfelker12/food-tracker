import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { Suspense } from "react";
import { FoodItemSkeleton, FoodListing } from "./_components/FoodListing";
import { FoodSearch } from "./_components/FoodSearch";

export default function Page() {
  return (
    <main className="flex justify-center p-4 h-full">
      <div className="flex flex-col gap-6 w-full">
        <div className="space-y-1">
          <h1 className="font-semibold text-xl">Lebesmittel tracken</h1>
          {/* <p className="text-muted-foreground text-sm">Suche nach einem Lebensmittel und klicke auf das "+" um dieses zu deinem Tagebuch hinzuzufügen</p> */}
        </div>

        <FoodSearch />

        <Suspense fallback={<Loader />}>
          <FoodListingWrap />
        </Suspense>
      </div>
    </main>
  );
}

async function FoodListingWrap() {
  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.food.list.queryOptions({ input: {} }))

  return (
    <HydrateClient client={qc}>
      <FoodListing />
    </HydrateClient>
  )
}

function Loader() {
  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: 3 }).map((_, index) => <FoodItemSkeleton key={index} />)}
    </div>
  );
}
