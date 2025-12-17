"use client"

import Link from "next/link";

import { APP_BASE_URL } from "@/lib/constants";
import { get_yyyymmdd_date, getGermanDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


interface JournalCalendarSelectedDialogProps extends React.ComponentProps<typeof Dialog> {
  selectedDate: Date | undefined
}
export function JournalCalendarSelectedDialog({ selectedDate, ...props }: JournalCalendarSelectedDialogProps) {
  if (!selectedDate) return null;

  const germanDate = getGermanDate(selectedDate)
  const yyyymmdd_date = get_yyyymmdd_date(selectedDate)

  return (
    <Dialog {...props}>
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
          <DialogClose asChild>
            <Button asChild variant="outline">
              <Link href={APP_BASE_URL + "/journal/" + yyyymmdd_date}>
                Gehe zum Tag
              </Link>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
