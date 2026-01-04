"use client"

import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { useFoodTrack } from "./FoodTrackProvider"


export function FoodTrackSubmit() {
  const { isPending } = useFoodTrack()

  return (
    <Button
      disabled={isPending}
    >
      {isPending ? <Spinner /> : <PlusIcon />} Tracken
    </Button>
  );
}
