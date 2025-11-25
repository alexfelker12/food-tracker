import { FullScreenLoader } from "@/components/FullScreenLoader";
import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { Suspense } from "react";
import { FoodDetails, FoodDetailsProps } from "./_components/FoodDetails";

export default async function Page({
  params,
}: {
  params: Promise<{ foodId: string }>
}) {
  const { foodId } = await params

  return (
    <main className="flex justify-center p-4 h-full">
      <div className="flex flex-col gap-6 w-full">
        <div className="space-y-1">
          {/* <h1 className="font-semibold text-xl">Lebesmittel tracken</h1> */}
          {/* <p className="text-muted-foreground text-sm">Suche nach einem Lebensmittel und klicke auf das "+" um dieses zu deinem Tagebuch hinzuzufügen</p> */}
        </div>

        <Suspense fallback={<FullScreenLoader />}>
          <FoodDetailsWrap foodId={foodId} />
        </Suspense>
      </div>
    </main>
  );
}

async function FoodDetailsWrap({ foodId }: FoodDetailsProps) {
  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.food.get.queryOptions({ input: { foodId } }))

  return (
    <HydrateClient client={qc}>
      <FoodDetails foodId={foodId} />
    </HydrateClient>
  )
}

// function Loader() {
//   return (
//     <div className="flex flex-col gap-1.5">
//       {Array.from({ length: 3 }).map((_, index) => <FoodItemSkeleton key={index} />)}
//     </div>
//   );
// }
