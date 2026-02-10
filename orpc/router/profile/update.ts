import z from "zod";

import type { NutritionResultModel } from "@/generated/prisma/models";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { profileSchema } from "@/schemas/profileSchema";

import { getUserLocalDateNow } from "@/lib/utils";

import { updateUserProfileAndLatestResult } from "@/server/actions/profile";


type ProcedureReturnType = NutritionResultModel
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
    context: { session, headers },
    errors
  }) => {
    const userLocalNow = getUserLocalDateNow(headers)

    const updatedUserProfile = await updateUserProfileAndLatestResult({
      userProfileData: input,
      userId: session.user.id,
      date: userLocalNow,
    })

    // error case checks
    switch (updatedUserProfile) {
      case "no profile":
        throw errors.NOT_FOUND() // not allowed to create another 
      case "invalid plan":
      case "parsing error":
        throw errors.BAD_REQUEST() // invalid input
      case "no result":
        throw errors.INTERNAL_SERVER_ERROR() // ...
    }

    // garantueed to be of length one because of "take: 1" and length check in create function
    return updatedUserProfile.nutritionResult[0]
  })
