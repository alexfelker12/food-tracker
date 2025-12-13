"use client"

import { useMutationState } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { SaveIcon, StepBackIcon, StepForwardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useProfileSteps } from "./ProfileSteps";


export function ProfileStepsFooter() {
  const { currentStep, stepBack, stepForward, maxStep } = useProfileSteps()

  const onboardCreateProfileState = useMutationState({
    filters: { mutationKey: orpc.onboard.mutationKey() },
    select: (mutation) => mutation.state.status === "pending"
  })
  const buttonsDisabled = onboardCreateProfileState.length > 0 ? onboardCreateProfileState[onboardCreateProfileState.length - 1] : false

  return (
    <div className="flex justify-between">
      {currentStep > 1 &&
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (buttonsDisabled) return
            stepBack()
          }}
          disabled={buttonsDisabled}
        >
          <StepBackIcon /> Zurück
        </Button>
      }
      <div className="opacity-0"></div>
      {currentStep < maxStep ?
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (buttonsDisabled) return
            // timeout to avoid triggering click on tap up after rendering submit button
            setTimeout(() => stepForward(), 0)
          }}
          disabled={buttonsDisabled}
        >
          Weiter <StepForwardIcon />
        </Button>
        :
        <Button
          type="submit"
          disabled={buttonsDisabled}
        >
          {buttonsDisabled ? <Spinner /> : <SaveIcon />} Speichern
        </Button>
      }
    </div >
  );
}
