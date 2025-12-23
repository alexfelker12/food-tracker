"use client"

import { FoodWithPortionsType } from "@/orpc/router/food/list";

import { useIntakeTimeParam } from "@/hooks/useIntakeTimeParam";

import { APP_BASE_URL } from "@/lib/constants";
import { getDefaultPortionData } from "@/lib/food.utils";

import { ArrowUpRightIcon } from "lucide-react";

import NoPrefetchLink from "@/components/NoPrefetchLink";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";


interface FoodListingItemProps extends React.ComponentProps<typeof Item> {
  food: FoodWithPortionsType
}
export function FoodListingItem({ food, ...props }: FoodListingItemProps) {
  const { kcal, name } = getDefaultPortionData(food)

  const { intakeTime, intakeTimeKey } = useIntakeTimeParam()

  const itemLink = `${APP_BASE_URL}/track/food/${food.id}${intakeTime
    ? `?${intakeTimeKey}=${intakeTime}`
    : ""
    }`

  return (
    <Item
      variant="outline"
      size="xs"
      // allow enter on Item to trigger navigation on anchor links
      onKeyDown={(e) => {
        if (["Enter", "ArrowUp", "ArrowDown"].includes(e.key)) {
          e.stopPropagation()
        }
      }}
      asChild
      {...props}
    >
      <NoPrefetchLink href={itemLink}>
        <ItemContent>
          <ItemTitle>{food.name}</ItemTitle>
          <ItemDescription>{kcal} kcal - {name}{food.brand && `, (${food.brand})`}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ArrowUpRightIcon />
        </ItemActions>
      </NoPrefetchLink>
    </Item>
  );
}

export function FoodItemSkeleton() {
  return (
    <Skeleton>
      <Item className="opacity-0" size="xs">
        <ItemContent>
          <ItemTitle>loading</ItemTitle>
          <ItemDescription>loading</ItemDescription>
        </ItemContent>
        <ItemActions>
          <div className="border border-border rounded-full size-8"></div>
        </ItemActions>
      </Item>
    </Skeleton>
  )
}
