"use client"

import { useEffect } from "react";

import { useFormContext, useWatch } from "react-hook-form";

import { changedProfileCalculation } from "@/server/helpers/changedProfileCalculation";

import { ProfileSchema } from "@/schemas/types";

import { macroPlanRegistry } from "./macro-plans/registry"


export function ProfileFormFieldSelectedPlan() {
  const { control, setValue } = useFormContext<ProfileSchema>()

  // get selected plan
  const [macroSplit] = useWatch({
    control,
    name: ["macroSplitStep.macroSplit"],
  })

  // calculate nutritionResult to provide to plan components
  const profileCalculation = useWatch({
    control,
    compute: ({ userDataStep, bodyDataStep, fitnessProfileStep, macroSplitStep }: ProfileSchema) => {
      return changedProfileCalculation({
        ...userDataStep,
        ...bodyDataStep,
        ...fitnessProfileStep,
        ...macroSplitStep,
      })
    },
  });

  // set recommended values as initial custom values
  useEffect(() => {
    if (macroSplit === "RECOMMENDED") {
      setValue("macroSplitStep.proteinTargetGrams", profileCalculation.nutritionResult.proteinsTargetGrams)
      setValue("macroSplitStep.fatTargetGrams", profileCalculation.nutritionResult.fatsTargetGrams)
    }
  }, [macroSplit])

  // render component depending on selected plan
  const SelectedPlanComponent = macroPlanRegistry[macroSplit]

  return (
    <SelectedPlanComponent {...profileCalculation} />
  );
}
