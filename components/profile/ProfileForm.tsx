"use client"

import { FormProvider, useForm } from "react-hook-form";

import { profileSchema, ProfileSchema } from "@/schemas/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { ProfileStepsContent } from "./parts/ProfileStepsContent";
import { ProfileStepsFooter } from "./parts/ProfileStepsFooter";
import { ProfileStepsHeader } from "./parts/ProfileStepsHeader";
import { ProfileSteps } from "./parts/ProfileSteps";


export function ProfileForm({ className, children, ...props }: React.ComponentProps<"form">) {
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      step1: { firstName: "", lastName: "" },
      step2: { email: "", age: 18 },
      step3: { agreeTerms: false },
    },
    mode: "onTouched",
  })

  const onSubmit = (values: ProfileSchema) => {
    console.log("values:", values)
  }

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col justify-between gap-8 py-8 size-full"
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
