"use client"

import { FieldValues, FormProvider } from "react-hook-form"

import { FieldGroup } from "@/components/ui/field"
import { FoodTrackContextValue, FoodTrackProvider } from "./components/FoodTrackProvider"


export interface FoodTrackProps<T extends FieldValues> extends
  React.ComponentProps<"form">,
  FoodTrackContextValue<T> { }
export function FoodTrack<T extends FieldValues = FieldValues>({
  form, consumable, isPending, onSubmitCallback, // provider
  children, ...props // form
}: FoodTrackProps<T>) {
  return (
    <FoodTrackProvider {...{ form, consumable, isPending, onSubmitCallback }}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmitCallback)} {...props}>
          <FieldGroup className="gap-4">
            {children}
          </FieldGroup>
        </form>
      </FormProvider>
    </FoodTrackProvider>
  );
}
