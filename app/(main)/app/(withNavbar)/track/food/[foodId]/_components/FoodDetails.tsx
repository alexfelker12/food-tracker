"use client"

// import React from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { FoodMacroChart } from "./FoodMacroChart";
import { BASE_PORTION_NAME } from "@/lib/constants";


type PortionMacrosArgs = {
  grams: number

}
export type FoodDetailsProps = {
  foodId: string
}
export function FoodDetails({ foodId }: FoodDetailsProps) {
  const { data: food } = useSuspenseQuery(orpc.food.get.queryOptions({ input: { foodId } }))

  const defaultPortion = food?.portions.find((portion) => portion.isDefault)
  const initialPortion = defaultPortion ?? food?.portions.find((portion) => portion.name === BASE_PORTION_NAME)!

  const [portionData, setPortionData] = useState([
    {
      macro: "fats",
      kcal: 275,
    },
    {
      macro: "carbs",
      kcal: 200,
    },
    {
      macro: "proteins",
      kcal: 187,
    },
  ])

  // TODO use form here (or better within a child component) to track a food

  const portionMacros = ({ }: PortionMacrosArgs) => {

  }

  // TODO add a ellipsis to the top right for users to go to update page
  // -> {APP_BASE_URL + "/track/food/[foodId]/update"}
  //* probably will just show the current create food form with a different onSubmit
  return (
    <div className="space-y-2">
      <h1 className="font-semibold text-xl">{food?.name}</h1>
      <pre className="text-sm overflow-x-auto">
        <code>{JSON.stringify(food, null, 2)}</code>
      </pre>
    </div>
  );
}

