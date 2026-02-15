"use client"

import { useFormContext, useWatch } from "react-hook-form";

import { changedProfileCalculation } from "@/server/helpers/changedProfileCalculation";

import { ProfileSchema } from "@/schemas/types";

import { macroPlanRegistry } from "./macro-plans/registry"


export function ProfileFormFieldSelectedPlan() {
  //? "use no memo"; <-- check if needed

  const { control } = useFormContext<ProfileSchema>()

  // get selected plan
  const [macroSplit] = useWatch({
    control,
    name: ["macroSplitStep.macroSplit"],
  })

  // calculate nutritionResult to provide to plan components
  const { nutritionResult, planValidity } = useWatch({
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

  // render component depending on selected plan
  const SelectedPlanComponent = macroPlanRegistry[macroSplit]

  return (
    <SelectedPlanComponent nutritionResult={nutritionResult} planValidity={planValidity} />
  );
}
