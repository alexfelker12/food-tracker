import { base } from "@/orpc/middleware/base"
import { authMiddleware } from "@/orpc/middleware/authorized"
import { profileSchema } from "@/schemas/profileSchema"
import { createNutritionResultFromProfile, createProfileFromSteps } from "@/server/actions/profile";
import z from "zod";
import { NutritionResultModel } from "@/generated/prisma/models";

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
    if (!session) throw errors.UNAUTHORIZED();

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

    const firstNutritionResult = await createNutritionResultFromProfile({
      profileData: initialProfile,
      useRecommended: input.macroSplitStep.useRecommended
    })

    return firstNutritionResult
  })
