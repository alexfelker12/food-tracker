"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { orpc } from "@/lib/orpc";
import { profileSchema } from "@/schemas/profileSchema";

import { ProfileSteps } from "./parts/ProfileSteps";
import { ProfileStepsContent } from "./parts/ProfileStepsContent";
import { ProfileStepsFooter } from "./parts/ProfileStepsFooter";
import { ProfileStepsHeader } from "./parts/ProfileStepsHeader";
import { ProfileCreateSuccess } from "./ProfileCreateSuccess";


export function ProfileForm({ className, children, ...props }: React.ComponentProps<"form">) {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      macroSplitStep: {
        useRecommended: true,
      },
    },
    mode: "onTouched",
  })

  const { mutate: createProfile, data } = useMutation(orpc.onboard.createProfile.mutationOptions({
    // onSuccess parameters: (data, variables, onMutateResult, context)
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Es gab Probleme beim Erstellen deines Profils. Versuche es nochmal!")
      }
    },
  }))

  return (
    <>
      <FormProvider {...form}>
        <form
          className="flex flex-col justify-between gap-8 size-full"
          onSubmit={form.handleSubmit((values) => createProfile(values))}
          {...props}
        >
          <ProfileSteps maxStep={4}>
            <ProfileStepsHeader />
            <ProfileStepsContent />
            <ProfileStepsFooter />
          </ProfileSteps>
        </form>
      </FormProvider>

      <ProfileCreateSuccess data={data} />
    </>
  );
}


// import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar"

// type FirstNutritionResultDisplayProps = {

// }
// function FirstNutritionResultDisplay({

// }: FirstNutritionResultDisplayProps) {
//   return (
//     <>
//       <AnimatedCircularProgressBar
//         value={40}
//         gaugePrimaryColor="rgb(79 70 229)"
//         gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
//       />
//     </>
//   );
// }
