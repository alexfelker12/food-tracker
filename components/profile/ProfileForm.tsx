"use client"

import { FormProvider, useForm } from "react-hook-form";

import { profileSchema } from "@/schemas/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { ProfileSteps } from "./parts/ProfileSteps";
import { ProfileStepsContent } from "./parts/ProfileStepsContent";
import { ProfileStepsFooter } from "./parts/ProfileStepsFooter";
import { ProfileStepsHeader } from "./parts/ProfileStepsHeader";
import { toast } from "sonner";
import { ProfileSchema } from "@/schemas/types";


export function ProfileForm({ className, children, ...props }: React.ComponentProps<"form">) {
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      macroSplitStep: {
        useRecommended: true,
        fatSplit: 25,
        carbSplit: 50,
        proteinSplit: 25
      },
    },
    mode: "onTouched",
  })

  // if (form.formState.errors.userDataStep) console.log("Page 1 errors:", form.formState.errors.userDataStep)
  // if (form.formState.errors.bodyDataStep) console.log("Page 2 errors:", form.formState.errors.bodyDataStep)
  // if (form.formState.errors.fitnessProfileStep) console.log("Page 3 errors:", form.formState.errors.fitnessProfileStep)
  // if (form.formState.errors.macroSplitStep) console.log("Page 4 errors:", form.formState.errors.macroSplitStep)

  const onSubmit = (values: ProfileSchema) => {
    console.log("values:", values)
    console.log(values.userDataStep.birthDate?.toLocaleDateString())
    toast("Gespeicherte Werte", {
      position: "bottom-center",
      description: (
        <pre className="mt-2 p-4 rounded-md overflow-x-auto">
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
        <ProfileSteps maxStep={4}>
          <ProfileStepsHeader />
          <ProfileStepsContent />
          <ProfileStepsFooter />
        </ProfileSteps>
      </form>
    </FormProvider>
  );
}

