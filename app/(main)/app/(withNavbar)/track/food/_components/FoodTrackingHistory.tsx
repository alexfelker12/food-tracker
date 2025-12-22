"use client"

import { useEffect, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { HistoryIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CommandEmpty, CommandItemRaw, CommandListRaw } from "@/components/ui/command";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader } from "@/components/ui/empty";

import { FoodListingItem } from "./FoodListingItem";
import { FoodListingLabel } from "./FoodListingLabel";
import { useFoodSearch } from "./FoodSearchContext";


export function FoodTrackingHistory() {
  const { data: trackedFoods } = useSuspenseQuery(orpc.journal.history.listPastWeek.queryOptions())

  return (
    <CommandListRaw className="**:[[cmdk-list-sizer]]:space-y-1.5 max-h-auto">

      <FoodTrackingHistoryEmpty initialEmpty={trackedFoods.length === 0} />

      {trackedFoods.map((trackedFood) => (
        <CommandItemRaw
          key={trackedFood.id}
          value={trackedFood?.name}
          asChild
        >
          <FoodListingItem food={trackedFood} />
        </CommandItemRaw>
      ))}

      {/* <CommandGroupRaw heading="20.12.2025" className="**:[[cmdk-group-items]]:space-y-1.5 p-0"></CommandGroupRaw> */}
    </CommandListRaw>
  );
}

interface FoodTrackingHistoryEmptyProps {
  initialEmpty?: boolean
}
function FoodTrackingHistoryEmpty({ initialEmpty }: FoodTrackingHistoryEmptyProps) {
  const { input, setSearch } = useFoodSearch()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (initialEmpty) return (
    <CommandEmpty className="mt-2">
      <Empty className="gap-2 border w-full">
        <EmptyHeader>
          <EmptyDescription className="text-ellipsis text-pretty overflow-hidden" role="presentation">
            Du hast in den letzten 7 Tagen keine Lebensmittel getrackt
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </CommandEmpty>
  );

  return (
    <CommandEmpty className="mt-2" role="alert">
      <Empty className="gap-2 border w-full">
        <EmptyHeader>
          <EmptyDescription className="max-w-[calc(100dvw-var(--spacing)*21)] text-ellipsis text-wrap overflow-hidden" role="presentation">
            Keine Ergebnisse für <span className="inline-flex max-w-40 text-ellipsis text-primary-foreground text-wrap overflow-hidden">{input}</span> gefunden
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="outline"
            onClick={() => setSearch(input)}
          >
            <SearchIcon />
            <span className="inline-flex text-primary-foreground">
              '<span className="inline-block max-w-40 text-ellipsis text-nowrap overflow-hidden">{input}</span>'
            </span>
            Suchen
          </Button>
        </EmptyContent>
      </Empty>
    </CommandEmpty>
  );
}
