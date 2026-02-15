import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { getCalorieRangeFromCurrentNutritionResult } from "@/server/actions/dashboard";


type ProcedureReturnType = Awaited<ReturnType<typeof getCalorieRangeFromCurrentNutritionResult>>
export type CalorieRangeType = NonNullable<ProcedureReturnType>
export const getKcalRange = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/dashboard/kcalRange",
    summary: "Gets the minimum and maximum Calorie intake",
    tags: ["Dashboard"]
  })
  // .input()
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    // input,
    context: { session },
    errors
  }) => {
    const calorieRange = await getCalorieRangeFromCurrentNutritionResult({
      userId: session.user.id
    })

    if (!calorieRange) throw errors.NOT_FOUND()

    return calorieRange
  })
