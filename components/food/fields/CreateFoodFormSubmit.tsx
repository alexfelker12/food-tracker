"use client"

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/lib/orpc";
import { useMutationState } from "@tanstack/react-query";


export function CreateFoodFormSubmit() {
  const foodCreateState = useMutationState({
    filters: { mutationKey: orpc.food.create.mutationKey() },
    select: (mutation) => mutation.state.status === "pending"
  })
  const isPending = foodCreateState.length > 0 ? foodCreateState[foodCreateState.length - 1] : false

  return (
    <Button
      type="submit"
      disabled={isPending}
    >
      {isPending ? <Spinner /> : <PlusIcon />} Erstellen
    </Button>
  );
}
