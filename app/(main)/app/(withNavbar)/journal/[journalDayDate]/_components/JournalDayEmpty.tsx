"use client"

import Link from "next/link";

import { APP_BASE_URL } from "@/lib/constants";
import { get_yyyymmdd_date } from "@/lib/utils";

import { CalendarDaysIcon, ListXIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";


type JournalDayEmptyProps = {
  journalDayDate: Date
}
export function JournalDayEmpty({ journalDayDate }: JournalDayEmptyProps) {
  const dateParam = get_yyyymmdd_date(journalDayDate)
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ListXIcon />
        </EmptyMedia>
        <EmptyTitle>Hier ist nichts...</EmptyTitle>
        <EmptyDescription>
          Du hast für diesen Tag keine Lebensmittel oder Mahlzeiten getrackt
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href={APP_BASE_URL + "/journal"}><CalendarDaysIcon /> Zur Übersicht</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={APP_BASE_URL + "/track/food" + `?trackDay=${dateParam}`}><PlusIcon /> Lebensmittel tracken</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
