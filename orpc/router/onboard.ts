import z from "zod";

import { NutritionResultModel } from "@/generated/prisma/models";
import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";
import { profileSchema } from "@/schemas/profileSchema";
import { createNutritionResultFromProfile, createProfileFromSteps } from "@/server/actions/onboard";


export const createInitialProfile = base
  .use(authMiddleware)
  .route({
    method: "POST",
    path: "/onboard",
    summary: "Creates an initial profile and nutrition result",
    tags: ["Onboard"]
  })
  .input(profileSchema)
  .output(z.custom<NutritionResultModel>())
  .handler(async ({ input, context: { session }, errors }) => {
    const initialProfile = await createProfileFromSteps({
      userProfileData: input,
      userId: session.user.id
    })

    switch (initialProfile) {
      case "has profile":
        throw errors.FORBIDDEN() // not allowed to create another 
      case "parsing error":
        throw errors.BAD_REQUEST() // invalid input
    }

    const { id, userId, ...profileData } = initialProfile

    const firstNutritionResult = await createNutritionResultFromProfile({
      metricsProfileId: id,
      profileData,
      useRecommended: input.macroSplitStep.useRecommended
    })

    return firstNutritionResult
  })
