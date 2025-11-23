"use client"

// import React from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";
import { ArrowUpRightIcon, PlusIcon } from "lucide-react";

import NoPrefetchLink from "@/components/NoPrefetchLink";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";


export function FoodListing() {
  const { data: listing } = useSuspenseQuery(orpc.food.list.queryOptions({ input: {} }))

  const getDefaultPortionData = (food: (typeof listing)[number]) => {
    const defaultPortionData = {
      kcal: String(food.kcal),
      name: "100g"
    }

    // check if 100g is not default portion
    const defaultPortion = food.portions.find((portion) => portion.isDefault && portion.name !== "100g")

    if (defaultPortion) {
      defaultPortionData.kcal = (food.kcal * (defaultPortion.grams / 100)).toFixed(0)
      defaultPortionData.name = defaultPortion.name
    }

    return defaultPortionData
  }

  return (
    <ItemGroup className="gap-1.5">
      {listing.map((food) => {
        const { kcal, name } = getDefaultPortionData(food)
        return (
          <Item key={food.id} variant="outline" size="xs" asChild>
            <NoPrefetchLink href={`/app/track/food/${food.id}`}>
              <ItemContent>
                <ItemTitle>{food.name}</ItemTitle>
                <ItemDescription>{kcal} kcal - {name}, ({food.brand})</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ArrowUpRightIcon />
              </ItemActions>
            </NoPrefetchLink>
          </Item>
        )
      })}
    </ItemGroup>
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
