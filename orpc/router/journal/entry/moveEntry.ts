import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { IntakeTime } from "@/generated/prisma/client";

import { moveJournalEntry } from "@/server/actions/journal";


type ProcedureReturnType = NonNullable<Awaited<ReturnType<typeof moveJournalEntry>>>
export const moveEntry = base
  .use(authMiddleware)
  .route({
    method: "PATCH",
    path: "/journal/entry",
    summary: "Moves a journal entry to a different intake time",
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
    const updatedEntry = await moveJournalEntry({
      userId: session.user.id,
      journalEntryId,
      intakeTime: newIntakeTime
    })

    if (!updatedEntry) throw errors.FORBIDDEN()

    return updatedEntry
  })
