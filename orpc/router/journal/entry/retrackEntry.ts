import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { IntakeTime } from "@/generated/prisma/client";

import { retrackJournalEntry } from "@/server/actions/journal";


type ProcedureReturnType = NonNullable<Awaited<ReturnType<typeof retrackJournalEntry>>>
export const retrackEntry = base
  .use(authMiddleware)
  .route({
    method: "PUT",
    path: "/journal/entry",
    summary: "Duplicates (retracks) a journal entry to the selected intake time",
    tags: ["Journal", "Entry"]
  })
  .input(z.object({
    journalEntryId: z.string(),
    newIntakeTime: z.custom<IntakeTime>()
  }))
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    input: { journalEntryId, newIntakeTime },
    context: { session },
    errors
  }) => {
    const updatedEntry = await retrackJournalEntry({
      userId: session.user.id,
      journalEntryId,
      intakeTime: newIntakeTime
    })

    if (!updatedEntry) throw errors.FORBIDDEN()

    return updatedEntry
  })
