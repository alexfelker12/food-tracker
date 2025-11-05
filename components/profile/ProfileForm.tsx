"use client"

import { FormProvider, useForm } from "react-hook-form";

import { profileSchema, ProfileSchema } from "@/schemas/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { ProfileSteps } from "./parts/ProfileSteps";
import { ProfileStepsContent } from "./parts/ProfileStepsContent";
import { ProfileStepsFooter } from "./parts/ProfileStepsFooter";
import { ProfileStepsHeader } from "./parts/ProfileStepsHeader";
import { toast } from "sonner";


export function ProfileForm({ className, children, ...props }: React.ComponentProps<"form">) {
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      step1: {
        gender: undefined,
        age: 18,
        heightCm: 160,
        weightKg: 60,
        bodyType: undefined
      },
      step2: {
        fitnessGoal: undefined,
        activityLevel: undefined,
        trainingDaysPerWeek: 0
      },
      step3: {
        fatSplit: 25,
        carbSplit: 50,
        proteinSplit: 25
      },
    },
    mode: "onChange",
  })

  if (form.formState.errors.step1) console.log("Page 1 errors:", form.formState.errors.step1)
  if (form.formState.errors.step1) console.log("Page 2 errors:", form.formState.errors.step1)
  if (form.formState.errors.step3) console.log("Page 3 errors:", form.formState.errors.step3)

  const onSubmit = (values: ProfileSchema) => {
    console.log("values:", values)
    toast("Gespeicherte Werte", {
      position: "bottom-center",
      description: (
        <pre className="bg-code mt-2 p-4 rounded-md text-code-foreground overflow-x-auto">
          <code>{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
      duration: 15000
    })
  }

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col justify-between gap-8 size-full"
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <ProfileSteps>
          <ProfileStepsHeader />
          <ProfileStepsContent />
          <ProfileStepsFooter />
        </ProfileSteps>
      </form>
    </FormProvider>
  );
}
