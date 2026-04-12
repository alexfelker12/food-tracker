"use client"

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { NutrientDisplayRow } from "../nutrient/NutrientDisplayRow";
import { NutrientDisplayDetailed } from "../nutrient/NutrientDisplayDetailed";


export type JournalDayMacrosProps = {
  date: Date
  variant?: "row" | "detailed"
}
export function JournalDayMacros({ date, variant = "detailed" }: JournalDayMacrosProps) {
  const { data } = useSuspenseQuery(orpc.journal.day.getMacros.queryOptions({
    input: { date }
  }))

  const label = "Offene Nährwerte"

  return variant === "detailed"
    ? <NutrientDisplayDetailed label={label} {...data} />
    : <NutrientDisplayRow label={label} {...data} />
}
