"use client"

import Link from "next/link";
import { Suspense } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { APP_BASE_URL } from "@/lib/constants";
import { orpc } from "@/lib/orpc";
import { foodWithPortionsSchema } from "@/schemas/food/foodSchema";

import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";

import { CreateFoodFormSubmit } from "./fields/CreateFoodFormSubmit";
import { FoodLabeling } from "./fields/FoodLabeling";
import { FoodMacroValues } from "./fields/FoodMacroValues";
import { FoodPortions } from "./fields/FoodPortions";


export function CreateFoodForm({ className, children, ...props }: React.ComponentProps<"form">) {
  //* main form
  const form = useForm({
    resolver: zodResolver(foodWithPortionsSchema),
    defaultValues: {
      food: {
        name: "",
        brand: "",
      },
      portions: []
    },
    mode: "onTouched",
  })

  //* create food mutation
  const { mutate: createFood } = useMutation(orpc.food.create.mutationOptions({
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Es gab Probleme beim Erstellen dieses Lebensmittels. Versuche es nochmal!")
      }
    },
    // onSuccess parameters: (data, variables, onMutateResult, context)
    onSuccess: (data) => {
      form.reset()
      form.setValue("portions", [])
      console.log(data)

      toast("Lebensmittel wurde erfolgreich erstellt", {
        description: `${data.name} ${data.brand ? `- ${data.brand}` : ""}`,
        action: (
          <Button asChild variant="secondary">
            <Link href={`${APP_BASE_URL}/track/food/${data.id}`}>
              Zum Lebensmittel
            </Link>
          </Button>
        )
      })
    }
  }))

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-4 size-full"
        onSubmit={form.handleSubmit((values) => createFood(values))}
        // onSubmit={form.handleSubmit((values) => console.log(values))}
        {...props}
      >
        {/* name & brand */}
        <FoodLabeling />

        <FieldSeparator />

        {/* macro values */}
        <FoodMacroValues />

        <FieldSeparator />

        {/* portions */}
        <Suspense>
          <FoodPortions />
        </Suspense>

        <div className="flex justify-end mt-2">
          <CreateFoodFormSubmit />
        </div>
      </form>
    </FormProvider>
  );
}
