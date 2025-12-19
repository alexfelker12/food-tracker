"use client"

import { useState } from "react";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import { MacroSplitsStepSchema } from "@/schemas/profileSchema";
import { ProfileSchema } from "@/schemas/types";

import { MacroSplitField } from "./macro-splits/MacroSplitField";
import { changedProfileCalculation } from "@/server/helpers/changedProfileCalculation";


type SplitLabel = keyof typeof MacroSplitsStepSchema.shape

interface ProfileFormFieldMacroSplitsProps {
  initialRecommended?: boolean
}
export function ProfileFormFieldMacroSplits({ initialRecommended }: ProfileFormFieldMacroSplitsProps) {
  const { control, formState, setValue, getValues, watch } = useFormContext<ProfileSchema>();
  const [unlockedSplit, setUnlockedSplit] = useState<SplitLabel>("carbSplit") // default carbSplit locked
  const useRecommended = watch("macroSplitStep.useRecommended", initialRecommended)

  //* intercepts slider value change to check, if open sliders value sums up to more than 100
  //* -> dont allow change if so
  const handleSliderValueChange = (changedSplitKey: SplitLabel, slideChangeValue: number) => {
    // const stepValues = getValues(["macroSplitStep.fatSplit", "macroSplitStep.carbSplit", "macroSplitStep.proteinSplit"])
    const { fatSplit, carbSplit, proteinSplit } = getValues("macroSplitStep")
    const stepValues = { fatSplit, carbSplit, proteinSplit }
    const splitName: `macroSplitStep.${SplitLabel}` = `macroSplitStep.${unlockedSplit}`
    const changedSplitName: `macroSplitStep.${SplitLabel}` = `macroSplitStep.${changedSplitKey}`
    let openSplitsSum = 0 // will be incremented to the sum of splits that are not locked

    Object.entries(stepValues)
      .forEach(([splitKey, splitValue]) => {
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


  //* actual gram amount of split values
  const { amountFats, amountCarbs, amountProtein } = useWatch({
    control,
    compute: (data: ProfileSchema) => {
      const {
        userDataStep,
        bodyDataStep,
        fitnessProfileStep,
        macroSplitStep: { useRecommended, ...partialMacroSplitStep }
      } = data

      return changedProfileCalculation({
        profileData: {
          ...userDataStep,
          ...bodyDataStep,
          ...fitnessProfileStep,
          ...partialMacroSplitStep,
        },
        useRecommended
      })
    },
  });


  // derived state
  const fatsUnlocked = unlockedSplit === "fatSplit"
  const carbsUnlocked = unlockedSplit === "carbSplit"
  const proteinsUnlocked = unlockedSplit === "proteinSplit"

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 w-full">

        {/* fats */}
        <Controller
          name="macroSplitStep.fatSplit"
          control={control}
          render={({ field, fieldState }) => (
            <MacroSplitField
              label="Fettverteilung"
              description="Stelle deine gewünschte Makroverteilung für Fette ein. Du kannst den Slider entsperren, sodass sich der Wert automatisch an die übrigen Prozente angleicht."
              splitUnlocked={fatsUnlocked}
              useRecommended={useRecommended}

              value={[field.value]}
              onValueChange={(value) => {
                if (fatsUnlocked) return;
                if (handleSliderValueChange("fatSplit", value[0])) field.onChange(value[0]);
              }}
              onPressedChange={() => {
                if (!fatsUnlocked) setUnlockedSplit("fatSplit")
              }}
              splitGramAmount={amountFats}

              field={field}
              fieldState={fieldState}
            />
          )}
        />

        {/* carbs */}
        <Controller
          name="macroSplitStep.carbSplit"
          control={control}
          render={({ field, fieldState }) => (
            <MacroSplitField
              label="Kohlenhydratverteilung"
              description="Stelle deine gewünschte Makroverteilung für Kohlenhydrate ein. Du kannst den Slider entsperren, sodass sich der Wert automatisch an die übrigen Prozente angleicht."
              splitUnlocked={carbsUnlocked}
              useRecommended={useRecommended}

              value={[field.value]}
              onValueChange={(value) => {
                if (carbsUnlocked) return;
                if (handleSliderValueChange("carbSplit", value[0])) field.onChange(value[0]);
              }}
              onPressedChange={() => {
                if (!carbsUnlocked) setUnlockedSplit("carbSplit")
              }}
              splitGramAmount={amountCarbs}

              field={field}
              fieldState={fieldState}
            />
          )}
        />

        {/* protein */}
        <Controller
          name="macroSplitStep.proteinSplit"
          control={control}
          render={({ field, fieldState }) => (
            <MacroSplitField
              label="Proteinverteilung"
              description="Stelle deine gewünschte Makroverteilung für Proteine ein. Du kannst den Slider entsperren, sodass sich der Wert automatisch an die übrigen Prozente angleicht."
              splitUnlocked={proteinsUnlocked}
              useRecommended={useRecommended}

              value={[field.value]}
              onValueChange={(value) => {
                if (proteinsUnlocked) return;
                if (handleSliderValueChange("proteinSplit", value[0])) field.onChange(value[0]);
              }}
              onPressedChange={() => {
                if (!proteinsUnlocked) setUnlockedSplit("proteinSplit")
              }}
              splitGramAmount={amountProtein}

              field={field}
              fieldState={fieldState}
            />
          )}
        />

      </div>


      {/* 
      splits error, because of dynamic sider calculation and min/max error on single sliders is not possible
      ! this should never appear
      */
        formState.errors.macroSplitStep && <p className="text-destructive text-sm">
          {formState.errors.macroSplitStep.message}
        </p>
      }

    </div >
  );
}
