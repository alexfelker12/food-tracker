"use client"

import { useRouter } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";

import { ListJournalDaysType } from "@/orpc/router/journal/list";

import { orpc } from "@/lib/orpc";
import { get_yyyymmdd_date, getGermanDate } from "@/lib/utils";

import { Calendar1Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { APP_BASE_URL } from "@/lib/constants";
import { useState } from "react";
import { JournalCalendar } from "../../_components/JournalCalendar";
import { Badge } from "@/components/ui/badge";


export type JournalDayPickerProps = {
  date: Date
}
export function JournalDayPicker({ date }: JournalDayPickerProps) {
  const germanDate = getGermanDate(date)
  const yyyymmdd_date = get_yyyymmdd_date(date)

  const { data } = useSuspenseQuery(orpc.journal.list.queryOptions())
  if (!data) return <h1 className="font-bold text-2xl">{germanDate}</h1>;

  return (
    <JournalDayPickerWrap yyyymmdd_date_string={yyyymmdd_date} {...data}>
      <Button className="font-semibold text-lg" variant="secondary">
        <Calendar1Icon className="size-4.5" /> <span className="mt-0.5 leading-none">{germanDate}</span>
      </Button>
    </JournalDayPickerWrap>
  );
}

type JournalDayPickerWrapProps = ListJournalDaysType & {
  yyyymmdd_date_string: string
  children: React.ReactNode
}
function JournalDayPickerWrap({ yyyymmdd_date_string, children, journalDays, minDate }: JournalDayPickerWrapProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const today_yyyymmdd_date = get_yyyymmdd_date(new Date())

  const handleNavigation = (date: Date | "today") => {
    const navSuffix = date === "today" ? today_yyyymmdd_date : get_yyyymmdd_date(date)
    if (yyyymmdd_date_string !== navSuffix) { // not current journal day?
      router.push(APP_BASE_URL + `/journal/${navSuffix}`) // navigate to selected date
    }
    setOpen(false) // always close popver
  }

  const isToday = yyyymmdd_date_string === today_yyyymmdd_date

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="space-y-3 p-3 w-[min(var(--radix-popper-available-width),480px)]" collisionPadding={8}>
        <JournalCalendar
          journalDays={journalDays}
          minDate={minDate}
          captionLayout="dropdown-years"

          // on click behaviour
          selected={new Date(yyyymmdd_date_string)}
          noSelection={false}
          onDayClick={handleNavigation}
        />

        <div className="flex justify-between items-center gap-3 w-full">
          <div className="flex flex-wrap justify-start items-center gap-1">
            <span className="w-full text-muted-foreground text-sm">Tage:</span>
            {isToday
              ? <Badge>Heute</Badge>
              : <>
                <Badge>Aktiv</Badge>
                <Badge className="bg-accent text-accent-foreground">Heute</Badge>
              </>
            }
            <Badge className="bg-accent/80 text-foreground">Getrackt</Badge>
            <Badge variant="outline" className="text-muted-foreground/75">Leer</Badge>
          </div>
          {!isToday &&
            <Button
              variant="outline"
              onClick={() => handleNavigation("today")}
            >
              <Calendar1Icon /> Heute
            </Button>
          }
        </div>
      </PopoverContent>
    </Popover>
  );
}