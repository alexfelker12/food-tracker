import z from "zod";

import type { NutritionResultModel } from "@/generated/prisma/models";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { profileSchema } from "@/schemas/profileSchema";

import { getUserLocalDateNow } from "@/lib/utils";

import { createInitialProfileAndResult } from "@/server/actions/onboard";


type ProcedureReturnType = NutritionResultModel
export const createInitialProfile = base
  .use(authMiddleware)
  .route({
    method: "POST",
    path: "/onboard",
    summary: "Creates an initial profile and nutrition result",
    tags: ["Onboard"]
  })
  .input(profileSchema)
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    input,
    context: { session, headers },
    errors
  }) => {
    const userLocalNow = getUserLocalDateNow(headers)

    const initialProfileWithNutritionResult = await createInitialProfileAndResult({
      userProfileData: input,
      userId: session.user.id,
      date: userLocalNow
    })

    // error case checks
    switch (initialProfileWithNutritionResult) {
      case "has profile":
        throw errors.FORBIDDEN() // not allowed to create another 
      case "invalid plan":
      case "parsing error":
        throw errors.BAD_REQUEST() // invalid input
      case "no result":
        throw errors.INTERNAL_SERVER_ERROR() // ...
    }

    // garantueed to be of length one because of "take: 1" and length check in create function
    return initialProfileWithNutritionResult.nutritionResult[0]
  })
