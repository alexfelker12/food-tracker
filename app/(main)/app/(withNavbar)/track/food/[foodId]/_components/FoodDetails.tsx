"use client"

import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { BASE_PORTION_NAME } from "@/lib/constants";
import { orpc } from "@/lib/orpc";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { FoodTrackForm } from "./FoodTrackForm";
import { Separator } from "@/components/ui/separator";


type PortionMacrosArgs = {
  grams: number

}
export type FoodDetailsProps = {
  foodId: string
}
export function FoodDetails({ foodId }: FoodDetailsProps) {
  const { data: food } = useSuspenseQuery(orpc.food.get.queryOptions({ input: { foodId } }))

  if (!food) return null;

  // // TODO: currently, this component assumes the food actually exists (food is not null). If food does not exist, these 2 lines are wrong (initialPortion will be null/undefined):
  // const defaultPortion = food?.portions.find((portion) => portion.isDefault)
  // const initialPortion = defaultPortion ?? food?.portions.find((portion) => portion.name === BASE_PORTION_NAME)!

  // const [portionData, setPortionData] = useState([
  //   {
  //     macro: "fats",
  //     kcal: 275,
  //   },
  //   {
  //     macro: "carbs",
  //     kcal: 200,
  //   },
  //   {
  //     macro: "proteins",
  //     kcal: 187,
  //   },
  // ])

  // TODO use form here (or better within a child component) to track a food

  const portionMacros = ({ }: PortionMacrosArgs) => {

  }

  // TODO add a ellipsis to the top right for users to go to update page
  // -> {APP_BASE_URL + "/track/food/[foodId]/update"}
  //* probably will just show the current create food form with a different onSubmit
  return (
    <div className="space-y-2">
      <h1 className="font-semibold text-xl">{food?.name}</h1>
      {/* <pre className="text-xs overflow-x-auto">
        <code>{JSON.stringify(food, null, 2)}</code>
      </pre> */}

      <Separator />

      <h2>Lebensmittel Tracken</h2>

      <FoodTrackForm
        consumable={food}
        consumableType="FOOD"
      />
    </div>
  );
}

