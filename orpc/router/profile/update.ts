import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { profileSchema } from "@/schemas/profileSchema";

import { updateUserProfile, upsertNutritionResultFromProfileChange } from "@/server/actions/profile";


type ProcedureReturnType = Awaited<ReturnType<typeof upsertNutritionResultFromProfileChange>>
export type UserProfileType = NonNullable<ProcedureReturnType>
export const updateProfile = base
  .use(authMiddleware)
  .route({
    method: "PUT",
    path: "/profile/update",
    summary: "Updates the profile and nutrition result for a user",
    tags: ["Profile"]
  })
  .input(profileSchema)
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    input,
    context: { session },
    errors
  }) => {
    const now = new Date()
    const {
      userDataStep,
      bodyDataStep,
      fitnessProfileStep,
      macroSplitStep: { useRecommended, ...partialMacroSplitStep }
    } = input

    // exclude non profile data
    const userProfile = await updateUserProfile({
      userId: session.user.id,
      profileData: {
        ...userDataStep,
        ...bodyDataStep,
        ...fitnessProfileStep,
        ...partialMacroSplitStep,
      }
    })

    if (!userProfile) throw errors.NOT_FOUND()

    const { id, userId, ...profileData } = userProfile

    const changedUserProfile = await upsertNutritionResultFromProfileChange({
      metricsProfileId: id,
      updateDay: now,
      profileData,
      useRecommended: input.macroSplitStep.useRecommended
    })

    return changedUserProfile
  })
