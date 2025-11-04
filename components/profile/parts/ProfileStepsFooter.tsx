"use client"

import { Button } from "@/components/ui/button";
import { useProfileSteps } from "./ProfileSteps";


export function ProfileStepsFooter() {
  const { currentStep, stepBack, stepForward } = useProfileSteps()

  return (
    <div className="flex justify-between">
      {currentStep > 1 &&
        <Button type="button" variant="outline" onClick={stepBack}>Zurück</Button>
      }
      <div className="opacity-0"></div>
      {currentStep < 3 ?
        <Button type="button" variant="secondary" onClick={stepForward}>Weiter</Button>
        :
        <Button type="submit">Absenden</Button>
      }
    </div>
  );
}
