import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import type { WaterDemandSchema } from "@/schemas/types";

import { trackWaterByDate } from "@/server/actions/journal";


type ProcedureReturnType = Awaited<ReturnType<typeof trackWaterByDate>>
export const trackWater = base
  .use(authMiddleware)
  .route({
    method: "PATCH",
    path: "/journal/day/trackWater",
    summary: "Tracks consumed water in ml for a specific date",
    tags: ["Journal", "Day"]
  })
  .input(z.object({
    date: z.date(),
    waterDemandSchema: z.custom<WaterDemandSchema>()
  }))
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    input: { date, waterDemandSchema },
    context: { session },
    errors
  }) => {
    if (waterDemandSchema.amountMl === 0) throw errors.BAD_REQUEST()

    return await trackWaterByDate({
      userId: session.user.id,
      date,
      ...waterDemandSchema
    })
  })
