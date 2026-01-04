import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { RetrackJournalEntrySchema } from "@/schemas/types";

import { retrackJournalEntry } from "@/server/actions/journal";


type ProcedureReturnType = NonNullable<Awaited<ReturnType<typeof retrackJournalEntry>>>
export const retrackEntry = base
  .use(authMiddleware)
  .route({
    method: "POST",
    path: "/journal/entry",
    summary: "Creates a journal entry with the selected intake time and portion",
    tags: ["Journal", "Entry"]
  })
  .input(z.object({
    journalEntryId: z.string(),
    retrackSchema: z.custom<RetrackJournalEntrySchema>()
  }))
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    input: { journalEntryId, retrackSchema: { intakeTime, portionAmount, portionId } },
    context: { session },
    errors
  }) => {
    const retrackedEntry = await retrackJournalEntry({
      userId: session.user.id, journalEntryId,
      intakeTime, portionAmount, portionId
    })

    if (!retrackedEntry) throw errors.FORBIDDEN()

    return retrackedEntry
  })
