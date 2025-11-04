"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileSchema } from "@/schemas/profileSchema";

type FormContextType = {
  currentStep: number;
  nextStep: () => Promise<void>;
  prevStep: () => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function useProfileSteps() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormSteps must be used within ProfileStepsProvider");
  return ctx;
}

export function ProfileStepsProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const methods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      step1: { firstName: "", lastName: "" },
      step2: { email: "", age: 18 },
      step3: { agreeTerms: false },
    },
    mode: "onBlur",
  });

  const nextStep = async () => {
    const stepName = `step${currentStep}` as keyof ProfileSchema;
    const valid = await methods.trigger(stepName as any);
    if (!valid) return;
    setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const value = { currentStep, nextStep, prevStep };

  return (
    <FormContext.Provider value={value}>
      <FormProvider {...methods}>{children}</FormProvider>
    </FormContext.Provider>
  );
}
