"use client"

import { useEffect, useEffectEvent, useMemo } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from 'react-intersection-observer';

import { orpc } from "@/lib/orpc";
import { FoodListingType } from "@/orpc/router/food/list";

import { SearchCheckIcon, SearchSlashIcon, SearchXIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ItemGroup } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

import { FoodItemSkeleton, FoodListingItem } from "./FoodListingItem";
import { FoodListingLabel } from "./FoodListingLabel";
import { useFoodSearch } from "./FoodSearchContext";


export function FoodListing() {
  const { search, enabled } = useFoodSearch()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(orpc.food.list.infiniteOptions({
    input: (pageParam: string | undefined) => ({
      search,
      cursor: pageParam
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,

    // react query props
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  }))


  //* intersection observer to trigger infinite scroll
  const { ref: infiniteScollRef, inView } = useInView({
    rootMargin: "-90px" // bottom navbar with padding height
  });

  const handleFetchNextPage = useEffectEvent(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  })

  useEffect(() => {
    if (inView) handleFetchNextPage()
  }, [inView, data?.pages]);


  //* flatMap foods for easier rendering
  const foodListing = useMemo(() => data?.pages.flatMap((page) => page.foods) ?? [], [data])


  return (
    <ItemGroup className="gap-1.5 h-full">

      <FoodItemListing
        foodListing={foodListing}
        isLoading={isLoading}
      />

      {isFetchingNextPage && <div className="place-items-center grid w-full h-12">
        <Spinner className="text-primary size-5" />
      </div>}

      <div className="w-full h-px" ref={infiniteScollRef}></div>

    </ItemGroup>
  );
}


interface FoodItemListingProps {
  foodListing: FoodListingType
  isLoading: Boolean
}
function FoodItemListing({ foodListing, isLoading }: FoodItemListingProps) {
  const { enabled } = useFoodSearch()

  if (!enabled) return null;

  // initial loading skeleton - appears for every initial search
  if (isLoading) return <FoodListingSkeleton />

  if (foodListing.length === 0 && enabled) return <FoodListingEmpty />

  return (
    foodListing.map((food) => (
      <FoodListingItem key={food.id} food={food} />
    ))
  );
}


function FoodListingEmpty() {
  const { search, setSearch, setInput } = useFoodSearch()

  return (
    <Empty className="gap-4 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>Hier nicht ...</EmptyTitle>
        <EmptyDescription>
          <span className="inline-flex text-primary-foreground">'<span className="inline-block max-w-40 text-ellipsis text-wrap overflow-hidden">{search}</span>'</span> konnte nicht gefunden werden
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={() => {
          setSearch("")
          setInput("")
        }}>
          <SearchSlashIcon /> Suche zurücksetzen
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function FoodListingSkeleton({ length = 7 }: { length?: number }) {
  return Array.from({ length }).map((_, index) => <FoodItemSkeleton key={index} />)
}
