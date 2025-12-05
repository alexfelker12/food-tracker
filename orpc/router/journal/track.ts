import { BatchPayload } from "@/generated/prisma/internal/prismaNamespace";
import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";
import { journalEntrySchema } from "@/schemas/journal/journalEntrySchema";
import { createJournalEntry } from "@/server/actions/journal";
import z from "zod";

export const trackFood = base
  .use(authMiddleware)
  .route({
    method: "POST",
    path: "/journal/track",
    summary: "Tracks a consumable",
    tags: ["Journal"]
  })
  .input(journalEntrySchema)
  .output(z.custom<BatchPayload>())
  .handler(async ({
    input: { ...schemaProps },
    context: { session },
    errors
  }) => {
    const createdEntries = await createJournalEntry({
      userId: session.user.id,
      ...schemaProps
    })

    if (!createdEntries) throw errors.BAD_REQUEST() // invalid input/portion not found

    return { count: createdEntries.length }
  })
