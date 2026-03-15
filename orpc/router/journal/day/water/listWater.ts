import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { getWaterEntriesByDate } from "@/server/actions/journal";


type ProcedureReturnType = Awaited<ReturnType<typeof getWaterEntriesByDate>>
export type ListWaterEntriesType = ProcedureReturnType
export const listWaterEntries = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/journal/day/water",
    summary: "Gets all water entries by date",
    tags: ["Journal", "Day", "Water"]
  })
  .input(z.object({
    date: z.date()
  }))
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    input: { date },
    context: { session },
    errors
  }) => {
    const journalDays = await getWaterEntriesByDate({
      userId: session.user.id,
      date
    })

    if (!journalDays) throw errors.FORBIDDEN()

    return journalDays
  })
