"use client"

import { useEffect, useEffectEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { ProfileSchema } from "@/schemas/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";

import { NutritionResultDisplay } from "./NutritionResultDisplay";
import { SelectedPlanProps } from "./registry";


export function CustomPlan(props: SelectedPlanProps) {
  const { planValidity, nutritionResult } = props
  const { control, formState, setError, clearErrors } = useFormContext<ProfileSchema>();

  // min/max for custom plan sliders
  const proteinSliderMin = 50
  const proteinSliderMax = 300
  const fatsSliderMin = 30
  const fatsSliderMax = 200

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
                      <span className="text-foreground">{value?.toFixed(0)}</span>g
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
                    min={proteinSliderMin}
                    max={proteinSliderMax}
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <div className="flex justify-between items-center gap-2 w-full text-muted-foreground text-xs">
                    <span>{proteinSliderMin}g</span>
                    <span>{proteinSliderMax}g</span>
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
                      <span className="text-foreground">{value?.toFixed(0)}</span>g
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
                    min={fatsSliderMin}
                    max={fatsSliderMax}
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <div className="flex justify-between items-center gap-2 w-full text-muted-foreground text-xs">
                    <span>{fatsSliderMin}g</span>
                    <span>{fatsSliderMax}g</span>
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
