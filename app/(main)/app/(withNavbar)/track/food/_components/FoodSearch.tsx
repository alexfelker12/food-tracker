"use client"

import { useState } from "react";

import { HistoryIcon, SearchCheckIcon } from "lucide-react";

import { CommandRaw } from "@/components/ui/command";

import { FoodListing } from "./FoodListing";
import { FoodSearchContext } from "./FoodSearchContext";
import { FoodSearchInput } from "./FoodSearchInput";
import { FoodListingLabel } from "./FoodListingLabel";
import { cn } from "@/lib/utils";


export function FoodSearch({
  children
}: {
  children: React.ReactNode
}) {
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")
  const enabled = search.length > 0

  return (
    <FoodSearchContext.Provider value={{
      input, setInput,
      search, setSearch,
      enabled,
    }}>
      <CommandRaw
        className="gap-4 bg-transparent"
        // prevent cmdk keyboard navigation to mimic basic links listing accessibility
        onKeyDown={(e) => {
          if (["ArrowUp", "ArrowDown", "Enter", "Home", "End"].includes(e.key)) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
      >

        {/* has CommandInput inside */}
        <FoodSearchInput />

        <div className="relative space-y-2">

          <FoodListingLabel
            classname={cn(
              "opacity-100 transition-[opacity,scale] duration-150 scale-y-100",
              enabled && "opacity-0 scale-y-50"
            )}
            labelLeft={<><HistoryIcon /> <span className="leading-none">Verlauf</span></>}
            labelRight="letzte 7 Tage"
          />
          <FoodListingLabel
            classname={cn("top-0 left-0 absolute opacity-0 w-full transition-[opacity,scale] duration-150 scale-y-50",
              enabled && "opacity-100 scale-y-100"
            )}
            labelLeft={<><SearchCheckIcon /> <span className="leading-none">Suche</span></>}
          />

          {enabled
            ? <FoodListing />
            : children
          }
        </div>

      </CommandRaw>
    </FoodSearchContext.Provider>
  );
}
