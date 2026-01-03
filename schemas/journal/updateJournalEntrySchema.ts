import { journalEntrySchema } from "./journalEntrySchema"

export const updateJournalEntrySchema = journalEntrySchema.pick({
  portionAmount: true,
  portionId: true,
})
