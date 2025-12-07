"use client"

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { de } from "react-day-picker/locale";

import { APP_BASE_URL } from "@/lib/constants";
import { orpc } from "@/lib/orpc";
import { cn, get_yyyymmdd_date } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


// interface JournalCalendarProps {}
export function JournalCalendar() {
  const { data: journalDays } = useSuspenseQuery(orpc.journal.list.queryOptions({ input: {} }))

  const [open, setOpen] = useState(false)
  const selectedDateRef = useRef<Date>(undefined)

  const weekFromToday = useMemo(() => {
    const date = new Date()
    const day = date.getDate()
    date.setDate(day + 6)
    return date
  }, [(new Date()).getDate()]) // should only be reevaluated when day changes

  return (
    <>
      <Calendar
        // appearance
        mode="single"
        disabled={{
          after: weekFromToday // disable all dates after one week from today (max tracking selection range)
        }}
        className="p-0 [&_.rdp-day]:text-muted-foreground/75 [--cell-size:--spacing(10)]" // shadow-sm border rounded-lg
        classNames={{
          today: "bg-accent rounded-md [&>button]:after:content-none [&[data-today=true]>button]:text-accent-foreground! [&[data-today=true]>button]:text-base"
        }}
        buttonVariant="outline"
        modifiers={{
          trackedDay: journalDays.map((journalDay) => journalDay.date)
        }}
        modifiersClassNames={{
          trackedDay: cn(
            "[&>button]:text-foreground!",
            // ::after-circle
            "[&>button]:after:content-[''] [&>button]:after:size-8 [&>button]:after:bg-accent/80 [&>button]:after:absolute [&>button]:after:top-1/2 [&>button]:after:left-1/2 [&>button]:after:-translate-y-1/2 [&>button]:after:-translate-x-1/2 [&>button]:after:rounded-full [&>button]:after:-z-10 [&>button]:after:pointer-events-none"
          ),
        }}
        components={{
          DayButton: (props) => (
            <CalendarDayButton
              {...props}
              data-selected-single={false} // no selection styles"
            />
          )
        }}

        // on click behaviour
        selected={undefined}
        onDayClick={(date) => {
          selectedDateRef.current = date
          setOpen(true)
        }}

        // locale options
        locale={de}
        timeZone="Europe/Berlin"
        showWeekNumber
      />

      <SelectedJournalDayDialog
        open={open}
        onOpenChange={setOpen}
        selectedDate={selectedDateRef.current}
      />
    </>
  );
}

interface SelectedJournalDayDialogProps extends React.ComponentProps<typeof Dialog> {
  selectedDate: Date | undefined
}
function SelectedJournalDayDialog({ selectedDate, ...props }: SelectedJournalDayDialogProps) {
  if (!selectedDate) return null;

  const germanDate = selectedDate.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
  const yyyymmdd_date = get_yyyymmdd_date(selectedDate)

  return (
    <Dialog
      {...props}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{germanDate}</DialogTitle>
          <DialogDescription className="sr-only">
            Kurzer Überblick über das Tracking für diesen Tag
          </DialogDescription>
        </DialogHeader>
        <div>
          display journal day data here
        </div>
        <DialogFooter>
          <Button asChild variant="outline">
            <Link href={APP_BASE_URL + "/journal/" + yyyymmdd_date}>
              Gehe zum Tag
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
