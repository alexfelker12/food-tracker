import { redirect } from "next/navigation";
import { Suspense } from "react";

import { APP_BASE_URL, journalDayRegex } from "@/lib/constants";
import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { get_yyyymmdd_date, getGermanDate } from "@/lib/utils";

import { ChevronLeftIcon } from "lucide-react";

import { BackButton } from "@/components/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

import { JournalDay, JournalDayProps } from "./_components/JournalDay";
import { JournalDayMacros } from "./_components/JournalDayMacros";


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
  const germanDate = getGermanDate(thisDate)

  return (
    <main className="flex justify-center p-4 h-full">
      <div className="flex flex-col gap-6 w-full">

        <div className="flex justify-between items-center">
          <BackButton
            referrerPath={APP_BASE_URL + '/journal' as `/${string}`}
            size="icon-sm"
            variant="secondary"
          >
            <ChevronLeftIcon />
          </BackButton>
          <h1 className="font-bold text-2xl">{germanDate}</h1>
          <div className="size-8"></div>
        </div>

        <div className="flex flex-col flex-1 gap-4 has-data-[slot=empty]:gap-0">
          <Suspense fallback={<Skeleton className="w-full h-[110px]" />}>
            <JournalDayMacroWrap date={thisDate} />
          </Suspense>
          <Suspense fallback={<div className="place-items-center grid w-full h-40">
            <Spinner className="text-primary size-6" />
          </div>}>
            <JournalDayWrap date={thisDate} />
          </Suspense>
        </div>

      </div>
    </main>
  );
}

async function JournalDayWrap({ date }: JournalDayProps) {
  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.journal.day.getEntries.queryOptions({
    input: { date }
  }))

  return (
    <HydrateClient client={qc}>
      <JournalDay date={date} />
    </HydrateClient>
  )
}

async function JournalDayMacroWrap({ date }: JournalDayProps) {
  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.journal.day.getMacros.queryOptions({
    input: { date }
  }))

  return (
    <HydrateClient client={qc}>
      <JournalDayMacros date={date} />
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
