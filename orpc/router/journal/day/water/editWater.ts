import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { WaterDemandSchema } from "@/schemas/types";

import { editWaterEntryById } from "@/server/actions/journal";


type ProcedureReturnType = NonNullable<Awaited<ReturnType<typeof editWaterEntryById>>>
export const editWaterEntry = base
  .use(authMiddleware)
  .route({
    method: "PATCH",
    path: "/journal/day/water",
    summary: "Edits the tracked amount of water for a water entry",
    tags: ["Journal", "Day", "Water"]
  })
  .input(z.object({
    journalEntryId: z.string(),
    waterDemandSchema: z.custom<WaterDemandSchema>()
  }))
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    input: { journalEntryId, waterDemandSchema: { amountMl } },
    context: { session },
    errors
  }) => {
    const updatedEntry = await editWaterEntryById({
      userId: session.user.id,
      journalEntryId,
      amountMl
    })

    if (!updatedEntry) throw errors.FORBIDDEN()

    return updatedEntry
  })
