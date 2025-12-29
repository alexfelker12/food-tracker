"use client"

import Link from "next/link";
import { useRef, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { ListJournalDaysType } from "@/orpc/router/journal/list";

import { orpc } from "@/lib/orpc";

import { Calendar1Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { JournalCalendar } from "./JournalCalendar";
import { JournalCalendarSelectedDialog } from "./JournalCalendarSelectedDialog";
import { APP_BASE_URL } from "@/lib/constants";


// interface JournalCalendarViewProps { } // { }: JournalCalendarViewProps
export function JournalCalendarView() {
  const { data } = useSuspenseQuery(orpc.journal.list.queryOptions())

  if (!data) return null;

  return (
    <JournalCalendarViewWrap journalDays={data.journalDays} minDate={data.minDate} />
  );
}

function JournalCalendarViewWrap({ journalDays, minDate }: ListJournalDaysType) {
  const [open, setOpen] = useState(false)
  const selectedDateRef = useRef<Date>(undefined)

  return (
    <div className="space-y-3 w-full">
      <JournalCalendar
        journalDays={journalDays}
        minDate={minDate}
        captionLayout="dropdown-years"

        // on click behaviour
        selected={undefined}
        onDayClick={(date) => {
          selectedDateRef.current = date
          setOpen(true)
        }}
      />

      <div className="flex justify-between items-center w-full">
        <div className="flex flex-wrap justify-start items-center gap-1">
          <span className="w-full text-sm">Tage:</span>
          {/* <Badge>Ausgewählt</Badge> */}
          <Badge className="bg-accent text-accent-foreground">Heute</Badge>
          <Badge className="bg-accent/80 text-foreground">Getrackt</Badge>
          <Badge variant="outline" className="text-muted-foreground/75">Leer</Badge>
        </div>
        <Button asChild variant="outline">
          <Link href={APP_BASE_URL + "/journal/today"}>
            <Calendar1Icon /> Heute
          </Link>
        </Button>
      </div>

      <JournalCalendarSelectedDialog
        open={open}
        onOpenChange={setOpen}
        selectedDate={selectedDateRef.current}
      />
    </div>
  );
}
