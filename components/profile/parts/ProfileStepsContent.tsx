"use client"

import { useProfileSteps } from "./ProfileSteps";
import { ProfileFormBodyData as ProfileFormStep1 } from "./steps/ProfileFormBodyData";
import { ProfileFormFitnessData as ProfileFormStep2 } from "./steps/ProfileFormFitnessData";
import { ProfileFormSplitData as ProfileFormStep3 } from "./steps/ProfileFormSplitData";


export function ProfileStepsContent() {
  const { currentStep } = useProfileSteps()

  if (currentStep === 1) return <ProfileFormStep1 />
  if (currentStep === 2) return <ProfileFormStep2 />
  if (currentStep === 3) return <ProfileFormStep3 />
  return null;

  //* all, for dev purposes
  // return (
  //   <>
  //     <ProfileFormStep1 />
  //     <ProfileFormStep2 />
  //     <ProfileFormStep3 />
  //   </>
  // );
}
