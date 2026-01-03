import { z } from "zod";

import { UpdateJournalEntrySchema } from "@/schemas/types";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { updateJournalEntryFood } from "@/server/actions/journal";


type ProcedureReturnType = NonNullable<Awaited<ReturnType<typeof updateJournalEntryFood>>>
export const updateEntryFood = base
  .use(authMiddleware)
  .route({
    method: "PUT",
    path: "/journal/entry",
    summary: "Updates the tracked portion and it's amount",
    tags: ["Journal", "Entry"]
  })
  .input(z.object({
    journalEntryId: z.string(),
    updateSchema: z.custom<UpdateJournalEntrySchema>()
  }))
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    input: { journalEntryId, updateSchema: { portionAmount, portionId } },
    context: { session },
    errors
  }) => {
    const updatedEntry = await updateJournalEntryFood({
      userId: session.user.id, journalEntryId,
      portionAmount, portionId
    })

    if (!updatedEntry) throw errors.FORBIDDEN()

    return updatedEntry
  })
