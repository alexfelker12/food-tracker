import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";
import { getJournalDayWithEntries } from "@/server/actions/journal";
import z from "zod";

export const journalDayEntriesByDate = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/journal/day/entries",
    summary: "Gets a journal day with it's journal entries",
    tags: ["Journal", "Day"]
  })
  .input(z.object({
    date: z.date()
  }))
  .output(z.custom<Awaited<ReturnType<typeof getJournalDayWithEntries>>>())
  .handler(async ({
    input: { date },
    context: { session },
    // errors
  }) => {
    return await getJournalDayWithEntries({
      userId: session.user.id,
      date
    })
  })
