import { JournalEntry } from "@/generated/prisma/client";
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
  .output(z.custom<JournalEntry | BatchPayload>())
  .handler(async ({
    input: { ...schemaProps },
    context: { session },
    errors
  }) => {
    console.log("begin procedure")
    const createdEntries = await createJournalEntry({
      userId: session.user.id,
      ...schemaProps
    })

    if (!createdEntries) throw errors.BAD_REQUEST() // invalid input/portion not found
    console.log("entries were created")

    return createdEntries.length > 1
      ? { count: createdEntries.length }
      : createdEntries[0]
  })
