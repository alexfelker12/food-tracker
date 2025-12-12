import { JournalEntry } from "@/generated/prisma/client";
import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";
import { deleteJournalEntry } from "@/server/actions/journal";
import z from "zod";

export const deleteEntry = base
  .use(authMiddleware)
  .route({
    method: "DELETE",
    path: "/journal/entry",
    summary: "Deletes a journal entry from a users journal day",
    tags: ["Journal", "Entry"]
  })
  .input(z.object({
    journalEntryId: z.string()
  }))
  .output(z.custom<JournalEntry>())
  .handler(async ({
    input: { journalEntryId },
    context: { session },
    // errors
  }) => {
    return await deleteJournalEntry({
      userId: session.user.id,
      journalEntryId
    })
  })
