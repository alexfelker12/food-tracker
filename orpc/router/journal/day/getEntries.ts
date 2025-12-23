import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { getGroupedJournalEntries, getJournalEntriesByDate } from "@/server/actions/journal";


type ProcedureReturnType = Awaited<ReturnType<typeof getGroupedJournalEntries>>
export type GroupedJournalEntriesReturn = ProcedureReturnType
export type JournalEntriesByDateReturn = Awaited<ReturnType<typeof getJournalEntriesByDate>>

export const journalEntriesByDate = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/journal/day/entries",
    summary: "Gets journal entries by date, grouped by intake time",
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
    const allJournalEntriesByDate = await getJournalEntriesByDate({
      userId: session.user.id,
      date
    })

    return await getGroupedJournalEntries({
      journalEntries: allJournalEntriesByDate
    })
  })
