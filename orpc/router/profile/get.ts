import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { getUserProfile } from "@/server/actions/profile";


type ProcedureReturnType = Awaited<ReturnType<typeof getUserProfile>>
export type UserProfileType = NonNullable<ProcedureReturnType>
export const getProfile = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/profile/get",
    summary: "Gets the profile and nutrition result for a user",
    tags: ["Profile"]
  })
  // .input()
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    // input,
    context: { session },
    errors
  }) => {
    const userProfile = await getUserProfile({
      userId: session.user.id
    })

    if (!userProfile) throw errors.NOT_FOUND()

    return userProfile
  })
