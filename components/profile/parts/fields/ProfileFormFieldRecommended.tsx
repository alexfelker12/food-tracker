"use client"

import { useEffect, useState } from "react";

import { Controller, useFormContext } from "react-hook-form";

import { type CalculateRecommendedBodyTypeSplitsProps, calculateRecommendedSplitsByBodyType } from "@/lib/calculations/profile";
import { cn } from "@/lib/utils";
import { ProfileSchema } from "@/schemas/types";

import { LucideIcon, SlidersHorizontalIcon, SparklesIcon } from "lucide-react";

import { Field, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const recommendedSwitcherItems: {
  id: "recommended" | "custom"
  title: string
  description: string
  icon: LucideIcon
}[] = [{
  id: "recommended",
  title: "Empfohlen",
  description: "Nutze eine von uns nach deinen Angaben empfohlene Nährstoffverteilung",
  icon: SparklesIcon
},
{
  id: "custom",
  title: "Anpassen",
  description: "Passe deine Nährstoffverteilung ganz selbst an",
  icon: SlidersHorizontalIcon
}]

export function ProfileFormFieldRecommended() {
  const { control, setValue, getValues } = useFormContext<ProfileSchema>();

  const calcRecommendedData = {
    bodyType: getValues("bodyDataStep.bodyType"),
    fitnessGoal: getValues("fitnessProfileStep.fitnessGoal")
  }

  const applyRecommendedValues = ({ bodyType, fitnessGoal }: Partial<CalculateRecommendedBodyTypeSplitsProps>) => {
    if (!bodyType || !fitnessGoal) return
    const { fatSplit, carbSplit, proteinSplit } = calculateRecommendedSplitsByBodyType({ bodyType, fitnessGoal })

    setValue("macroSplitStep.fatSplit", fatSplit)
    setValue("macroSplitStep.carbSplit", carbSplit)
    setValue("macroSplitStep.proteinSplit", proteinSplit)
  }

  useEffect(() => {
    applyRecommendedValues(calcRecommendedData)
  }, [])

  return (
    <Controller
      name="macroSplitStep.useRecommended"
      control={control}
      render={({ field, fieldState }) => (
        <RadioGroup
          name={field.name}
          value={field.value ? "recommended" : "custom"}
          onValueChange={(value) => {
            const recommendedSelected = value === "recommended"

            if ((field.value && recommendedSelected) || (!field.value && !recommendedSelected)) return;
            field.onChange(recommendedSelected)
            field.onBlur()

            if (recommendedSelected) applyRecommendedValues(calcRecommendedData)
          }}
          className="gap-2 grid-cols-2"
        >
          {recommendedSwitcherItems.map(({ id, title, description, icon }) => {
            const radioId = id + "-splits"
            const Icon = icon
            const isActive = (field.value && id === "recommended") || (!field.value && id === "custom")

            return (
              <FieldLabel key={id} className="hover:bg-accent dark:hover:bg-input/50 focus-within:border-ring hover:text-accent-foreground transition-all focus-within:ring-ring/50 focus-within:ring-[3px]" htmlFor={radioId}>
                <Field className="justify-center gap-1.5 p-2!" orientation="horizontal" data-invalid={fieldState.invalid}>
                  <RadioGroupItem
                    value={id}
                    id={radioId}
                    aria-invalid={fieldState.invalid}
                    aria-description={description}
                    className="sr-only"
                  />
                  <Icon className={cn("text-muted-foreground size-4", isActive && "text-secondary-foreground")} />
                  <FieldTitle className={cn("flex-none! text-muted-foreground text-sm", isActive && "text-secondary-foreground")}>
                    {title}
                  </FieldTitle>
                </Field>
              </FieldLabel>
            )
          })}
        </RadioGroup>
      )}
    />
  );
}
