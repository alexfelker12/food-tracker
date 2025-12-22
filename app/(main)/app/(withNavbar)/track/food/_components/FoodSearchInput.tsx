"use client"

import { useRef } from "react";

import { cn } from "@/lib/utils";

import { SearchIcon, XIcon } from "lucide-react";

import { CommandInputRaw } from "@/components/ui/command";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

import { useFoodSearch } from "./FoodSearchContext";


export function FoodSearchInput() {
  const { input, setInput, search, setSearch } = useFoodSearch()
  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = input === ""

  return (
    <InputGroup className="**:data-[slot=command-input-wrapper]:flex-1 **:data-[slot=command-input-wrapper]:border-none w-full">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>

      <CommandInputRaw
        ref={inputRef}
        // controlled input
        value={input}
        onValueChange={(value) => {
          setInput(value)
          if (search !== "") setSearch("") // "unset" search value to disable infiniteQuery
        }}
        // set search value to trigger infiniteQuery on enter
        onKeyDown={(e) => {
          switch (e.key) {
            case "Enter":
              setSearch(inputRef.current?.value || "")
              break
            case "ArrowDown":
            case "ArrowUp":
              e.stopPropagation()
              break
            default:
              return
          }
        }}
        placeholder="Lebensmittel suchen..."
        asChild
      >
        <InputGroupInput />
      </CommandInputRaw>

      <InputGroupAddon className="mr-0! pr-1.5" align="inline-end">
        <InputGroupButton
          onClick={() => {
            // reset search and input on click
            setInput("")
            setSearch("")
            inputRef.current?.focus()
          }}
          size="icon-xs"
          // hide if no input
          className={cn("",
            disabled && "opacity-0! pointer-events-none",
          )}
          disabled={disabled}
        >
          <XIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
