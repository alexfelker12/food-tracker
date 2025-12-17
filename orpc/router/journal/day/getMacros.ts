import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";
import { getJournalDayMacros } from "@/server/actions/journal";
import z from "zod";

export const journalDayMacrosByDate = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/journal/day/macros",
    summary: "Gets the open macros and calories for a journal day",
    tags: ["Journal", "Day"]
  })
  .input(z.object({
    date: z.date()
  }))
  .output(z.custom<NonNullable<Awaited<ReturnType<typeof getJournalDayMacros>>>>())
  .handler(async ({
    input: { date },
    context: { session },
    // errors
  }) => {
    return await getJournalDayMacros({
      userId: session.user.id,
      date
    })
  })
