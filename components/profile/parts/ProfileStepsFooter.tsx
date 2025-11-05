"use client"

import { SaveIcon, StepBackIcon, StepForwardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProfileSteps } from "./ProfileSteps";


export function ProfileStepsFooter() {
  const { currentStep, stepBack, stepForward } = useProfileSteps()

  return (
    <div className="flex justify-between">
      {currentStep > 1 &&
        <Button type="button" variant="outline" onClick={stepBack}><StepBackIcon />Zurück</Button>
      }
      <div className="opacity-0"></div>
      {currentStep < 3 ?
        <Button type="button" variant="secondary" onClick={stepForward}>Weiter <StepForwardIcon /></Button>
        :
        <Button type="submit"><SaveIcon />Speichern</Button>
      }
    </div>
  );
}
