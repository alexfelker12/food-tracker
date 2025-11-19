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
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";


export function ProfileForm({ className, children, ...props }: React.ComponentProps<"form">) {
  const form = useForm({
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

  const { mutate } = useMutation(orpc.onboard.createProfile.mutationOptions())

  const onSubmit = (values: ProfileSchema) => {
    mutate(values, {
      // callback parameters: (data, variables, onMutateResult, context)
      onSuccess: (data) => {
        toast("Nutritionresult", {
          position: "bottom-center",
          description: (
            <pre className="mt-2 p-4 rounded-md overflow-x-auto">
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),
          duration: 20000
        })
      },
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
