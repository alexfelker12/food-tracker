import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { getWaterDemandByDate } from "@/server/actions/journal";


type ProcedureReturnType = Awaited<ReturnType<typeof getWaterDemandByDate>>
export type WaterDemandByDateReturn = NonNullable<ProcedureReturnType>

export const waterDemandByDate = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/journal/day/waterDemand",
    summary: "Gets the water demand for a journal day",
    tags: ["Journal", "Day"]
  })
  .input(z.object({
    date: z.date()
  }))
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    input: { date },
    context: { session },
    // errors
  }) => {
    return await getWaterDemandByDate({
      userId: session.user.id,
      date
    })
  })
