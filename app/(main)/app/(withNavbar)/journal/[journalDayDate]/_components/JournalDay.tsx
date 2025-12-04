"use client"

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { Separator } from "@/components/ui/separator";


export type JournalDayProps = {
  journalDay: string
}
export function JournalDay({ journalDay }: JournalDayProps) {
  // const { data:  } = useSuspenseQuery(orpc..queryOptions({
  //   input: {  },
  // }))

  // if (!food) return <FoodNotFound />

  return (
    <div className="space-y-2">
      <div>
        {/* <h2 className="font-semibold text-xl">{}</h2>
        <p className="text-base text-muted-foreground">{}</p> */}
      </div>

      <Separator />

      {/* ... */}

    </div>
  );
}
