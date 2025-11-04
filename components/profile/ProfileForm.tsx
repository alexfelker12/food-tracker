"use client";

import { cn } from "@/lib/utils";

import { useFormContext } from "react-hook-form";
import { ProfileSchema } from "@/schemas/profileSchema";
import { ProfileStepsProvider, useProfileSteps } from "./ProfileFormContext";
import { ProfileFormStep1 } from "./steps/ProfileFormStep1";
import { ProfileFormStep2 } from "./steps/ProfileFormStep2";
import { ProfileFormStep3 } from "./steps/ProfileFormStep3";
import { Button } from "../ui/button";


export function ProfileForm() {
  return (
    <ProfileStepsProvider>
      <ProfileFormInner />
    </ProfileStepsProvider>
  );
}

function ProfileFormInner() {
  const { currentStep, nextStep, prevStep } = useProfileSteps();

  const { handleSubmit } = useFormContext<ProfileSchema>(); // from RHF

  const onSubmit = (values: ProfileSchema) => {
    console.log("Gesamtdaten:", values);
    // hier API call etc.
  };

  return (
    // <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 p-2 w-full">
    //   <ProfileFormStep1 />
    //   <ProfileFormStep2 />
    //   <ProfileFormStep3 />
    //   <Button type="submit">Absenden</Button>
    // </form>

    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 p-2 w-full">
      {currentStep === 1 && <ProfileFormStep1 />}
      {currentStep === 2 && <ProfileFormStep2 />}
      {currentStep === 3 && <ProfileFormStep3 />}
      <div className={cn("flex justify-between", currentStep === 1 && "justify-end")}>
        {currentStep > 1 && (
          <Button type="button" variant="outline" onClick={prevStep}>
            Zurück
          </Button>
        )}
        {currentStep < 3 && (
          <Button type="button" variant="outline" onClick={nextStep}>
            Weiter
          </Button>
        )}
        {currentStep === 3 && <Button type="submit">Absenden</Button>}
      </div>
    </form>
  );
}
