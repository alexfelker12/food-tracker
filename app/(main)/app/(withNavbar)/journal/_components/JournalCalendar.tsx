"use client"

import { useMemo } from "react";

import { DayPickerProps } from "react-day-picker";
import { de } from "react-day-picker/locale";

import { ListJournalDaysType } from "@/orpc/router/journal/list";

import { cn } from "@/lib/utils";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";


type JournalCalendarProps = DayPickerProps & ListJournalDaysType & {
  noSelection?: boolean
  displayLegend?: boolean
}
export function JournalCalendar({ journalDays, minDate, noSelection = true, displayLegend, className, ...dayPickerProps }: JournalCalendarProps) {
  const weekFromToday = useMemo(() => {
    const date = new Date()
    const day = date.getDate()
    date.setDate(day + 6)
    return date
  }, [(new Date()).getDate()]) // should only be reevaluated when day changes

  return (
    <Calendar
      // functionality
      mode="single"
      disabled={{
        before: minDate,
        after: weekFromToday // disable all dates after one week from today (max tracking selection range)
      }}
      startMonth={minDate} // limit months user can navigate to to the first NutritionResult and one week from today
      endMonth={weekFromToday} // ^

      // appearance
      className={cn(
        "**:[.rdp-week>td,.rdp-weekdays>th]:flex-1 w-full", // responsive styling
        "p-0 [&_.rdp-day]:text-muted-foreground/75", // bare hightlight styling of days without journal entries 
        "[&_.rdp-day[data-selected=true]_button]:text-primary-foreground! [&_.rdp-day[data-selected=true]_button]:text-base",
        className
      )} // shadow-sm border rounded-lg
      classNames={{
        today: "bg-accent rounded-md [&>button]:after:content-none [&[data-today=true]:not([data-selected=true])_button]:text-accent-foreground! [&[data-today=true]>button]:text-base"
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

      // allowes to control whether days can have a selected styling or not
      {...(noSelection
        ? {
          components: {
            DayButton: (props) => (
              <CalendarDayButton
                {...props}
                data-selected-single={false} // no selection styles
              />
            )
          }
        }
        : {}
      )}

      // locale options
      locale={de}
      timeZone="Europe/Berlin"
      showWeekNumber

      // spread/override other props
      {...dayPickerProps}
    />
  );
}
