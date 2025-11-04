"use client"

import { ProfileSchema } from "@/schemas/profileSchema";
import { createContext, ReactNode, use, useState } from "react";
import { useFormContext } from "react-hook-form";

type ProfileStepsContextType = {
  currentStep: number
  prevStep: number
  stepForward: () => Promise<void>
  stepBack: () => void
  toStep: (step: number) => void
}

const ProfileStepsContext = createContext<ProfileStepsContextType | undefined>(undefined)

export function useProfileSteps() {
  const ctx = use(ProfileStepsContext)
  if (!ctx) throw new Error("useProfileSteps must be used within ProfileStepsProvider")
  return ctx
}

export function ProfileSteps({
  children
}: {
  children: ReactNode
}) {
  const { trigger } = useFormContext<ProfileSchema>()

  const [currentStep, setCurrentStep] = useState(1)
  const [prevStep, setPrevStep] = useState(1)

  const isCurrentStepValid = async () => {
    const stepName = `step${currentStep}` as keyof ProfileSchema
    return await trigger(stepName);
  }

  const stepForward = async () => {
    if (!(await isCurrentStepValid())) return
    setCurrentStep((s) => s + 1)
    setPrevStep(currentStep)
  }

  const stepBack = () => {
    setCurrentStep((s) => Math.max(1, s - 1))
    setPrevStep(currentStep)
  }

  const toStep = async (step: number) => {
    // dont allow to skip forward more than 1 step
    if (step - currentStep > 1) return;
    if (step - currentStep > 0 && !(await isCurrentStepValid())) return;
    setCurrentStep(step)
    setPrevStep(currentStep)
  }

  return (
    <ProfileStepsContext.Provider value={{ currentStep, prevStep, stepForward, stepBack, toStep }}>
      {children}
    </ProfileStepsContext.Provider>
  );
}
