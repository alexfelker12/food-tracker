"use client"

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { FoodTrackForm } from "@/components/track/FoodTrackForm";
import { Separator } from "@/components/ui/separator";

import { FoodNotFound } from "./FoodNotFound";


export type FoodDetailsProps = {
  foodId: string
}
export function FoodDetails({ foodId }: FoodDetailsProps) {
  const { data: food } = useSuspenseQuery(orpc.food.get.queryOptions({
    input: { foodId },
  }))

  if (!food) return <FoodNotFound />

  return (
    <div className="space-y-2">
      <div>
        <h2 className="font-semibold text-xl">{food.name}</h2>
        {food.brand && <p className="text-base text-muted-foreground">{food.brand}</p>}
      </div>

      <Separator />

      <FoodTrackForm
        consumable={food}
        consumableType="FOOD"
        className="pt-2"
      />
    </div>
  );
}
