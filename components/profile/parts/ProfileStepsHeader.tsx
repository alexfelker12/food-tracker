"use client"

import { FormStep, FormStepper } from "@/components/ui/form-stepper";
import { useProfileSteps } from "./ProfileSteps";


export function ProfileStepsHeader() {
  const { currentStep, toStep } = useProfileSteps()

  return (
    <FormStepper
      maxStep={3}
      currentStep={currentStep}
    >
      <FormStep step={1} onClick={() => toStep(1)} />
      <FormStep step={2} onClick={() => toStep(2)} />
      <FormStep step={3} onClick={() => toStep(3)} />
    </FormStepper>
  );
}
