"use client"

import { useProfileSteps } from "./ProfileSteps";
import { ProfileFormUserData as ProfileFormStep1 } from "./steps/ProfileFormUserData";
import { ProfileFormBodyData as ProfileFormStep2 } from "./steps/ProfileFormBodyData";
import { ProfileFormFitnessData as ProfileFormStep3 } from "./steps/ProfileFormFitnessData";
import { ProfileFormSplitData as ProfileFormStep4 } from "./steps/ProfileFormSplitData";


export function ProfileStepsContent() {
  const { currentStep } = useProfileSteps()

  if (currentStep === 1) return <ProfileFormStep1 />
  if (currentStep === 2) return <ProfileFormStep2 />
  if (currentStep === 3) return <ProfileFormStep3 />
  if (currentStep === 4) return <ProfileFormStep4 />
  return null;

  //* all, for dev purposes
  // return (
  //   <>
  //     <ProfileFormStep1 />
  //     <ProfileFormStep2 />
  //     <ProfileFormStep3 />
  //     <ProfileFormStep4 />
  //   </>
  // );
}
