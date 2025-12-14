import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { getCaloryRangeFromCurrentNutritionResult } from "@/server/actions/dashboard";


type ProcedureReturnType = Awaited<ReturnType<typeof getCaloryRangeFromCurrentNutritionResult>>
export type CaloryRangeType = NonNullable<ProcedureReturnType>
export const getKcalRange = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/dashboard/kcalRange",
    summary: "Gets the minimum and maximum Calory intake",
    tags: ["Dashboard"]
  })
  // .input()
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    // input,
    context: { session },
    errors
  }) => {
    const caloryRange = await getCaloryRangeFromCurrentNutritionResult({
      userId: session.user.id
    })

    if (!caloryRange) throw errors.NOT_FOUND()

    return caloryRange
  })
