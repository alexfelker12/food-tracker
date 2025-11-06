"use client"

import { useState } from "react";

import { Controller, useFormContext } from "react-hook-form";

import { ProfileSchema, Step3Schema } from "@/schemas/profileSchema";

import { LockIcon, LockOpenIcon, MoveRightIcon } from "lucide-react";

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";


type SplitLabel = keyof typeof Step3Schema.shape

export function ProfileFormFieldMacroSplits() {
  const { control, formState, setValue, getValues } = useFormContext<ProfileSchema>();

  const [unlockedSplit, setUnLockedSplit] = useState<SplitLabel>("carbSplit") // default carbSplit locked

  //* intercepts slider value change to check, if open sliders value sums up to more than 100
  //* -> dont allow change if so
  const handleSliderValueChange = (changedSplitKey: SplitLabel, slideChangeValue: number) => {
    const splitValues = getValues("step3")
    const splitName: `step3.${SplitLabel}` = `step3.${unlockedSplit}`
    const changedSplitName: `step3.${SplitLabel}` = `step3.${changedSplitKey}`
    let openSplitsSum = 0 // will be incremented to the sum of splits that are not locked

    Object.entries(splitValues).forEach(([splitKey, splitValue]) => {
      if (splitKey === unlockedSplit) return; // don't increment when splitValue is from unlockedSplit
      openSplitsSum += splitKey === changedSplitKey ? slideChangeValue : splitValue // take new value instead of current
    })

    if (openSplitsSum <= 100) {
      setValue(splitName, 100 - openSplitsSum) // subtract sum of open splits to get the value for the locked split
      return true
    } else {
      setValue(splitName, 0) // slider values should never go lower than 0
      setValue(changedSplitName, slideChangeValue - (openSplitsSum - 100)) // cap changing slider value to max value possible
      return false
    }
  }

  const getLockIcon = (label: SplitLabel) => {
    return label === unlockedSplit ? <LockOpenIcon className="size-3.5" /> : <LockIcon className="size-3.5" />
  }

  // derived state
  const fatsUnlocked = unlockedSplit === "fatSplit"
  const carbsUnlocked = unlockedSplit === "carbSplit"
  const proteinsUnlocked = unlockedSplit === "proteinSplit"

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-7 w-full">

        {/* fats */}
        <Controller
          name="step3.fatSplit"
          control={control}
          render={({ field, fieldState }) => (
            <Field orientation="vertical" data-invalid={fieldState.invalid}>

              <FieldContent className="gap-1">

                <FieldLabel id="step3.fatSplit" className="flex justify-between gap-2 w-full">
                  <span>Fettverteilung</span>
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <span>{field.value}%</span>
                    <MoveRightIcon aria-description="ergibt wert" />
                    <span className="text-secondary-foreground">{150}g</span>
                  </span>
                </FieldLabel>

                <FieldDescription className="sr-only">
                  Stelle deine gewünschte Makroverteilung für Fette ein
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>

              <div className="flex gap-3">
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => {
                    if (fatsUnlocked) return;
                    if (handleSliderValueChange("fatSplit", value[0])) field.onChange(value[0]);
                  }}
                  aria-invalid={fieldState.invalid}
                  className="w-full transition-opacity"
                  aria-label="Price Range"
                  aria-describedby="step3.fatSplit"
                  disabled={fatsUnlocked}
                />
                <Toggle
                  aria-label="Sperre Fette"
                  pressed={fatsUnlocked}
                  onPressedChange={() => { if (!fatsUnlocked) setUnLockedSplit("fatSplit") }}
                >
                  {getLockIcon("fatSplit")}
                </Toggle>
              </div>

            </Field>
          )}
        />

        {/* carbs */}
        <Controller
          name="step3.carbSplit"
          control={control}
          render={({ field, fieldState }) => (
            <Field orientation="vertical" data-invalid={fieldState.invalid}>

              <FieldContent className="gap-1">

                <FieldLabel id="step3.carbSplit" className="flex justify-between gap-2 w-full">
                  <span>Kohlenhydratverteilung</span>
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <span>{field.value}%</span>
                    <MoveRightIcon aria-description="ergibt wert" />
                    <span className="text-secondary-foreground">{150}g</span>
                  </span>
                </FieldLabel>

                <FieldDescription className="sr-only">
                  Stelle deine gewünschte Makroverteilung für Kohlenhydrate ein
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>

              <div className="flex gap-2">
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => {
                    if (carbsUnlocked) return
                    field.onChange(value[0])
                    if (handleSliderValueChange("carbSplit", value[0])) field.onChange(value[0]);
                  }}
                  aria-invalid={fieldState.invalid}
                  className="w-full transition-opacity"
                  aria-label="Price Range"
                  aria-describedby="step3.carbSplit"
                  disabled={carbsUnlocked}
                />
                <Toggle
                  aria-label="Sperre Kohlenhydrate"
                  pressed={carbsUnlocked}
                  onPressedChange={() => { if (!carbsUnlocked) setUnLockedSplit("carbSplit") }}
                >
                  {getLockIcon("carbSplit")}
                </Toggle>
              </div>

            </Field>
          )}
        />

        {/* protein */}
        <Controller
          name="step3.proteinSplit"
          control={control}
          render={({ field, fieldState }) => (
            <Field orientation="vertical" data-invalid={fieldState.invalid}>

              <FieldContent className="gap-1">

                <FieldLabel id="step3.proteinSplit" className="flex justify-between gap-2 w-full">
                  <span>Proteinverteilung</span>
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <span>{field.value}%</span>
                    <MoveRightIcon aria-description="ergibt wert" />
                    <span className="text-secondary-foreground">{150}g</span>
                  </span>
                </FieldLabel>

                <FieldDescription className="sr-only">
                  Stelle deine gewünschte Makroverteilung für Proteine ein
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>

              <div className="flex gap-2">
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => {
                    if (proteinsUnlocked) return
                    field.onChange(value[0])
                    if (handleSliderValueChange("proteinSplit", value[0])) field.onChange(value[0]);
                  }}
                  aria-invalid={fieldState.invalid}
                  className="w-full transition-opacity"
                  aria-label="Price Range"
                  aria-describedby="step3.proteinSplit"
                  disabled={proteinsUnlocked}
                />
                <Toggle
                  aria-label="Sperre Proteine"
                  pressed={proteinsUnlocked}
                  onPressedChange={() => { if (!proteinsUnlocked) setUnLockedSplit("proteinSplit") }}
                >
                  {getLockIcon("proteinSplit")}
                </Toggle>
              </div>

            </Field>
          )}
        />

      </div>


      {/* 
      splits error, because of dynamic sider calculation and min/max error on single sliders is not possible
      ! this should never appear
      */
        formState.errors.step3 && <p className="text-destructive text-sm">
          {formState.errors.step3.message}
        </p>
      }

    </div >
  );
}
