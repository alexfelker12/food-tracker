"use client"

import { FormStep, FormStepper } from "@/components/ui/form-stepper";
import { useProfileSteps } from "./ProfileSteps";


export function ProfileStepsHeader() {
  const { currentStep, toStep, maxStep } = useProfileSteps()

  return (
    <FormStepper
      maxStep={maxStep}
      currentStep={currentStep}
    >
      {Array.from({ length: maxStep }).map((_, idx) => {
        const step = idx + 1
        return <FormStep key={step} step={step} onClick={() => toStep(step)} />
      })}
    </FormStepper>
  );
}
