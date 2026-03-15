import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { deleteJournalEntry } from "@/server/actions/journal";


type ProcedureReturnType = NonNullable<Awaited<ReturnType<typeof deleteJournalEntry>>>
export const deleteWaterEntry = base
  .use(authMiddleware)
  .route({
    method: "DELETE",
    path: "/journal/day/water",
    summary: "Deletes a tracked water entry",
    tags: ["Journal", "Day", "Water"]
  })
  .input(z.object({
    journalEntryId: z.string()
  }))
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    input: { journalEntryId },
    context: { session },
    errors
  }) => {
    const deletedEntry = await deleteJournalEntry({
      userId: session.user.id,
      journalEntryId
    })

    if (!deletedEntry) throw errors.NOT_FOUND()

    return deletedEntry
  })
