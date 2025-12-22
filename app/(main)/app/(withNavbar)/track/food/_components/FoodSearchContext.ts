"use client"

import { createContext, use } from "react";


type FoodSearchContextType = {
  // controlled input value of command input
  input: string
  setInput: (input: string) => void

  // confirmed/submitted input value for search
  search: string
  setSearch: (search: string) => void

  // search enabled only when search has a value
  enabled: boolean
}

export const FoodSearchContext = createContext<FoodSearchContextType | undefined>(undefined)
export function useFoodSearch() {
  const ctx = use(FoodSearchContext)
  if (!ctx) throw new Error("useFoodSearch must be used within FoodSearch")
  return ctx
}
