import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { getJournalDays, pastWeekJournalEntryFoods } from "@/server/actions/journal";


type ProcedureReturnType = Awaited<ReturnType<typeof pastWeekJournalEntryFoods>>
export type ListPastWeekJournalEntryFoods = NonNullable<ProcedureReturnType>
export const listPastWeekJournalEntryFoods = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/journal/history/listPastWeek",
    summary: "Gets all distinct foods user tracked in the last 7 days",
    tags: ["Journal", "History"]
  })
  // .input(journalEntrySchema)
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    // input: { ...schemaProps },
    context: { session },
    // errors
  }) => {
    return await pastWeekJournalEntryFoods({
      userId: session.user.id,
    })
  })
