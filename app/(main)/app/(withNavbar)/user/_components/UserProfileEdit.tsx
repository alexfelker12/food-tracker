"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { profileSchema } from "@/schemas/profileSchema";

import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";

import { SaveIcon, XIcon } from "lucide-react";

import { ProfileFormFieldActivityLevel } from "@/components/profile/parts/fields/ProfileFormFieldActivityLevel";
import { ProfileFormFieldBirthDate } from "@/components/profile/parts/fields/ProfileFormFieldBirthDate";
import { ProfileFormFieldBodyType } from "@/components/profile/parts/fields/ProfileFormFieldBodyType";
import { ProfileFormFieldFitnessGoal } from "@/components/profile/parts/fields/ProfileFormFieldFitnessGoal";
import { ProfileFormFieldGender } from "@/components/profile/parts/fields/ProfileFormFieldGender";
import { ProfileFormFieldHeight } from "@/components/profile/parts/fields/ProfileFormFieldHeight";
import { ProfileFormFieldMacroSplits } from "@/components/profile/parts/fields/ProfileFormFieldMacroSplits";
import { ProfileFormFieldRecommended } from "@/components/profile/parts/fields/ProfileFormFieldRecommended";
import { ProfileFormFieldTrainingDays } from "@/components/profile/parts/fields/ProfileFormFieldTrainingDays";
import { ProfileFormFieldWeight } from "@/components/profile/parts/fields/ProfileFormFieldWeight";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import { useUserProfile } from "./UserProfileContext";
import { ProfileDataSection } from "./UserProfileView";


export function UserProfileEdit() {
  const { profile, queryKey, cancelEdit } = useUserProfile()
  const qc = useQueryClient()

  const { id, userId, nutritionResult, user, ...currentProfileData } = profile // extract profile data
  const {
    gender, birthDate,
    heightCm, weightKg, bodyType,
    fitnessGoal, activityLevel, trainingDaysPerWeek,
    fatSplit, carbSplit, proteinSplit,
  } = currentProfileData

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userDataStep: {
        gender, birthDate,
      },
      bodyDataStep: {
        heightCm, weightKg, bodyType,
      },
      fitnessProfileStep: {
        fitnessGoal, activityLevel, trainingDaysPerWeek,
      },
      macroSplitStep: {
        useRecommended: nutritionResult.usedRecommendedSplits,
        fatSplit,
        carbSplit,
        proteinSplit
      }
    },
    mode: "onTouched",
  })

  const { mutate: updateProfile, isPending } = useMutation(orpc.profile.update.mutationOptions({
    // onSuccess parameters: (data, variables, onMutateResult, context)
    onSuccess: () => {
      toast.success("Profil wurde gespeichert")
      cancelEdit()
      qc.invalidateQueries({ queryKey })
    },
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Es gab Probleme beim Erstellen deines Profils. Versuche es nochmal!")
      }
    },
  }))

  return (
    <CardContent className="px-4">
      <FormProvider {...form}>
        <form
          className={cn(
            "space-y-6",
            "**:data-[slot=field]:items-center",
            "**:data-[slot=field-description]:sr-only"
          )}
          onSubmit={form.handleSubmit((values) => updateProfile(values))}
        >
          {/* user data */}
          <ProfileDataSection label="Benutzerdaten">
            <ProfileFormFieldGender />
            <ProfileFormFieldBirthDate />
          </ProfileDataSection>

          {/* body data */}
          <ProfileDataSection label="Körperdaten">
            <ProfileFormFieldHeight />
            <ProfileFormFieldWeight />
            <ProfileFormFieldBodyType />
          </ProfileDataSection>

          {/* fitness data */}
          <ProfileDataSection label="Fitnessdaten">
            <ProfileFormFieldFitnessGoal />
            <ProfileFormFieldActivityLevel />
            <ProfileFormFieldTrainingDays />
          </ProfileDataSection>

          {/* split data */}
          <ProfileDataSection label="Makronährwertdaten" className="space-y-3" listingClassNames="gap-3">
            <ProfileFormFieldRecommended />
            <ProfileFormFieldMacroSplits initialRecommended={false} />
          </ProfileDataSection>

          <Separator className="mb-4" />

          <div className="flex justify-between w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => cancelEdit()}
              disabled={isPending}
            >
              <XIcon /> Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? <Spinner /> : <SaveIcon />} Speichern
            </Button>
          </div>
        </form>
      </FormProvider>
    </CardContent>
  );
}
