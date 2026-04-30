"use client"

import { useEffect, useEffectEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { getFatsRange, getProteinsRange } from "@/lib/calculations/profile";
import { ProfileSchema } from "@/schemas/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";

import { NutritionResultDisplay } from "./NutritionResultDisplay";
import { SelectedPlanProps } from "./registry";


export function CustomPlan(props: SelectedPlanProps) {
  const { planValidity, nutritionResult } = props
  const { control, formState, getValues, setValue, setError, clearErrors, trigger } = useFormContext<ProfileSchema>();

  //* get min/max values for custom plan sliders
  const weightKg = getValues("bodyDataStep.weightKg")
  const gender = getValues("userDataStep.gender")
  const { proteinsMinGrams, proteinsMaxGrams } = getProteinsRange({ weightKg })
  const { fatsMinGrams, fatsMaxGrams } = getFatsRange({ weightKg, gender })

  //* toggle error on macroSplitStep
  const handleCustomPlanError = useEffectEvent((isValid: boolean) => {
    if (!isValid) {
      setError("root", {
        message: "Kohlenhydrate dürfen nicht unter 0g fallen!",
        type: "custom",
      })
    } else {
      clearErrors("root")
    }
  })

  useEffect(() => {
    handleCustomPlanError(planValidity.isCarbAmountValid)
  }, [planValidity.isCarbAmountValid])

  return (
    <Card className="gap-3 rounded-md">
      <CardHeader className="gap-0">
        <CardTitle className="text-base leading-none">Eigene Makronährwerte</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="space-y-2">
          <Controller
            name="macroSplitStep.proteinTargetGrams"
            control={control}
            render={({ field: { value, onChange, ...field }, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldContent>
                  <FieldLabel className="justify-between gap-2 w-full">
                    <span>Protein-Zielmenge</span>
                    <span className="text-muted-foreground">
                      <span className="text-foreground">{value}</span>g
                    </span>
                  </FieldLabel>
                  <FieldDescription className="">
                    Gebe deine gewünschte tägliche Zielmenge für Proteine ein
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>

                <div className="flex flex-col gap-1.5">
                  <Slider
                    value={[value ?? 1]}
                    onValueChange={(value) => onChange(value[0])}
                    min={proteinsMinGrams}
                    max={proteinsMaxGrams}
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <div className="flex justify-between items-center gap-2 w-full text-muted-foreground text-xs">
                    <span>{proteinsMinGrams}g</span>
                    <span>{proteinsMaxGrams}g</span>
                  </div>
                </div>
              </Field>
            )}
          />

          <Controller
            name="macroSplitStep.fatTargetGrams"
            control={control}
            render={({ field: { value, onChange, ...field }, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldContent>
                  <FieldLabel className="justify-between gap-2 w-full">
                    <span>Fett-Zielmenge</span>
                    <span className="text-muted-foreground">
                      <span className="text-foreground">{value}</span>g
                    </span>
                  </FieldLabel>
                  <FieldDescription className="">
                    Gebe deine gewünschte tägliche Zielmenge für Fette ein
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>

                <div className="flex flex-col gap-1.5">
                  <Slider
                    value={[value ?? 1]}
                    onValueChange={(value) => onChange(value[0])}
                    min={fatsMinGrams}
                    max={fatsMaxGrams}
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <div className="flex justify-between items-center gap-2 w-full text-muted-foreground text-xs">
                    <span>{fatsMinGrams}g</span>
                    <span>{fatsMaxGrams}g</span>
                  </div>
                </div>
              </Field>
            )}
          />

          {/* validity errors */}
          {formState.errors.root ? (
            <FieldError errors={[formState.errors.root]} />
          ) : (
            <span className="text-muted-foreground italic">Kohlenhydrate passen sich automatisch an</span>
          )}
        </div>

        <NutritionResultDisplay {...props} />
      </CardContent>
    </Card>
  );
}
