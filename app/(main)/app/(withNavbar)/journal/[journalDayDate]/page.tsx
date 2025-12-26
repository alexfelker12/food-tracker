import { redirect } from "next/navigation";
import { Suspense } from "react";

import { APP_BASE_URL } from "@/lib/constants";
import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { cn, getGermanDate, isValidJournalDayDate, offsetDate } from "@/lib/utils";

import { ChevronLeftIcon } from "lucide-react";

import { BackButton } from "@/components/BackButton";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

import { JournalDay, JournalDayProps } from "./_components/JournalDay";
import { JournalDayMacros } from "./_components/JournalDayMacros";
import { JournalDayPicker } from "./_components/JournalDayPicker";


export default async function Page({
  params,
}: {
  params: Promise<{ journalDayDate: string }>
}) {
  const { journalDayDate } = await params

  if (!isValidJournalDayDate(journalDayDate)) redirect(APP_BASE_URL + "/journal");

  //* if param is "today" create offset date with "now" timestamp
  const journalDay = offsetDate(journalDayDate === "today" ? new Date() : new Date(journalDayDate))
  const germanDate = getGermanDate(journalDay)

  return (
    <main className="flex justify-center p-4 h-full">
      <div className="flex flex-col gap-6 w-full">

        <div className="flex justify-between items-center">
          <BackButton
            referrerPath={APP_BASE_URL + '/journal' as `/${string}`}
            size="icon"
            variant="secondary"
          >
            <ChevronLeftIcon />
          </BackButton>

          <Suspense fallback={
            <div className={cn(
              buttonVariants({ variant: "secondary" }),
              "font-semibold text-lg text-muted-foreground select-none"
            )}>
              <Spinner className="size-4.5" /> <span className="mt-0.5 leading-none">{germanDate}</span>
            </div>
          }>
            <JournalDayPickerWrap date={journalDay} />
          </Suspense>

          <div className="size-9"></div>
        </div>

        <div className="flex flex-col flex-1 gap-6">
          <Suspense fallback={<Skeleton className="w-full h-[110px]" />}>
            <JournalDayMacroWrap date={journalDay} />
          </Suspense>

          <Suspense fallback={<div className="place-items-center grid w-full h-40">
            <Spinner className="text-primary size-6" />
          </div>}>
            <JournalDayWrap date={journalDay} />
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

async function JournalDayPickerWrap({ date }: JournalDayProps) {
  const qc = getQueryClient()
  await qc.prefetchQuery(orpc.journal.list.queryOptions({
    input: { date }
  }))

  return (
    <HydrateClient client={qc}>
      <JournalDayPicker date={date} />
    </HydrateClient>
  )
}
