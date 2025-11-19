"use client"

import { useMutationState } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { FormStep, FormStepper } from "@/components/ui/form-stepper";
import { useProfileSteps } from "./ProfileSteps";


export function ProfileStepsHeader() {
  const { currentStep, toStep, maxStep } = useProfileSteps()

  const createProfileState = useMutationState({
    filters: { mutationKey: orpc.onboard.createProfile.mutationKey() },
    select: (mutation) => mutation.state.status === "pending"
  })
  const buttonsDisabled = createProfileState.length > 0 ? createProfileState[createProfileState.length - 1] : false

  return (
    <FormStepper
      maxStep={maxStep}
      currentStep={currentStep}
    >
      {Array.from({ length: maxStep }).map((_, idx) => {
        const step = idx + 1
        return (
          <FormStep
            key={step}
            step={step}
            disabled={buttonsDisabled}
            onClick={() => {
              if (buttonsDisabled) return;
              toStep(step)
            }}
          />
        )
      })}
    </FormStepper>
  );
}
