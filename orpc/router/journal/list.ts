import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { getJournalDays } from "@/server/actions/journal";


type ProcedureReturnType = Awaited<ReturnType<typeof getJournalDays>>
export type ListJournalDaysType = NonNullable<ProcedureReturnType>
export const listJournalDays = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/journal/list",
    summary: "Gets all days where user tracked",
    tags: ["Journal"]
  })
  // .input(journalEntrySchema)
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    // input: { ...schemaProps },
    context: { session },
    errors
  }) => {
    const journalDays = await getJournalDays({
      userId: session.user.id,
    })

    if (!journalDays) throw errors.FORBIDDEN()

    return journalDays
  })
