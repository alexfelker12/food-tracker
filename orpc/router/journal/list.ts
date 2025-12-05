import { JournalDay } from "@/generated/prisma/client";
import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";
import { getJournalDays } from "@/server/actions/journal";
import z from "zod";

export const listJournalDays = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/journal/list",
    summary: "Gets all days where user tracked",
    tags: ["Journal"]
  })
  // .input(journalEntrySchema)
  .output(z.custom<JournalDay[]>())
  .handler(async ({
    // input: { ...schemaProps },
    context: { session },
    // errors
  }) => {
    return await getJournalDays({
      userId: session.user.id,
    })
  })
