"use client"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { SearchIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

export function FoodSearch() {
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>

        <InputGroupInput
          ref={inputRef}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value)
          }}
          placeholder="Lebensmittel suchen..."
        />

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => {
              setSearch("")
              inputRef.current?.focus()
            }}
            size="icon-xs"
            className={cn("",
              search === "" && "opacity-0! pointer-events-none",
            )}
            disabled={search === ""}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
