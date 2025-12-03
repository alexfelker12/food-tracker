import { Suspense } from "react";

import { APP_BASE_URL } from "@/lib/constants";
import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { ChevronLeftIcon } from "lucide-react";

import { BackButton } from "@/components/BackButton";
import { FullScreenLoader } from "@/components/FullScreenLoader";

import { FoodDetails, FoodDetailsProps } from "./_components/FoodDetails";


export default async function Page({
  params,
}: {
  params: Promise<{ foodId: string }>
}) {
  const { foodId } = await params


  // TODO add a ellipsis to the top right for users to go to update page
  // -> {APP_BASE_URL + "/track/food/[foodId]/update"}
  //* probably will just show the current create food form with a different onSubmit

  return (
    <main className="flex justify-center p-4 h-full">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center gap-4">
          <BackButton
            referrerPath={APP_BASE_URL + '/track/food' as `/${string}`}
            size="icon-sm"
            variant="secondary"
          >
            <ChevronLeftIcon />
          </BackButton>
          <h1 className="font-bold text-xl">Lebesmittel tracken</h1>
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
