"use client"

import { createContext, use } from 'react';
import { FieldValues, UseFormReturn } from "react-hook-form"
import { FoodWithPortionsType } from "@/orpc/router/food/list"


//* ------------------ Context ------------------
export interface FoodTrackContextValue<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>
  consumable: FoodWithPortionsType
  isPending: boolean
  onSubmitCallback: (values: T) => void
}
const FoodTrackContext = createContext<FoodTrackContextValue<FieldValues> | undefined>(undefined)

export function useFoodTrack<T extends FieldValues>() {
  const ctx = use(FoodTrackContext)
  if (!ctx) throw new Error("useFoodTrack must be used within FoodTrackProvider")

  return ctx as FoodTrackContextValue<T>
}

//* ------------------ Provider ------------------
export function FoodTrackProvider<T extends FieldValues>({
  children,
  ...contextValues
}: FoodTrackContextValue<T> & {
  children: React.ReactNode
}) {
  return (
    <FoodTrackContext.Provider value={contextValues as FoodTrackContextValue<FieldValues>}>
      {children}
    </FoodTrackContext.Provider>
  )
}
