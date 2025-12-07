import { Suspense } from "react";

import { APP_BASE_URL, journalDayRegex } from "@/lib/constants";
import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { ChevronLeftIcon } from "lucide-react";

import { BackButton } from "@/components/BackButton";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { JournalDay, JournalDayProps } from "./_components/JournalDay";
import { redirect } from "next/navigation";
import { get_yyyymmdd_date } from "@/lib/utils";


export default async function Page({
  params,
}: {
  params: Promise<{ journalDayDate: string }>
}) {
  const { journalDayDate } = await params
  let journalDay = journalDayDate

  //* test the dynamic param against the journalDayRegex to check validity
  const isValidJournalDayDate = journalDayDate === "today" || journalDayRegex.test(journalDayDate)

  //* redirect to overview if invalid
  if (!isValidJournalDayDate) redirect(APP_BASE_URL + "/journal");

  //* if param is "today" create formatted string to use for incoming procedures
  if (journalDayDate === "today") journalDay = get_yyyymmdd_date(new Date());

  const thisDate = new Date(journalDay)
  const germanDate = thisDate.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })

  return (
    <main className="flex justify-center p-4 h-full">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center gap-4">
          <BackButton
            referrerPath={APP_BASE_URL + '/journal' as `/${string}`}
            size="icon-sm"
            variant="secondary"
          >
            <ChevronLeftIcon />
          </BackButton>
          <h1 className="font-bold text-2xl">{germanDate}</h1>
        </div>

        <Suspense fallback={<FullScreenLoader />}>
          <JournalDayWrap date={thisDate} />
        </Suspense>
      </div>
    </main>
  );
}

async function JournalDayWrap({ date }: JournalDayProps) {
  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.journal.day.get.queryOptions({
    input: { date }
  }))

  return (
    <HydrateClient client={qc}>
      <JournalDay date={date} />
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
