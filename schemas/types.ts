import { z } from "zod";

import { foodWithPortionsSchema } from "./food/foodSchema";
import { journalEntrySchema, retrackJournalEntrySchema, updateJournalEntrySchema } from "./journal/journalEntrySchema";
import { mergedProfileSchema, profileSchema } from "./profileSchema";


// Schemas
export type ProfileSchema = z.infer<typeof profileSchema>
export type FlatProfileSchema = z.infer<typeof mergedProfileSchema>

// misc
export type MacroSplits = {
  fatSplit: number
  carbSplit: number
  proteinSplit: number
}

// Food
export type FoodWithPortionsSchema = z.infer<typeof foodWithPortionsSchema>

// Journal entry
export type JournalEntrySchema = z.infer<typeof journalEntrySchema>

// Update Journal entry
export type UpdateJournalEntrySchema = z.infer<typeof updateJournalEntrySchema>

// Retrack Journal entry
export type RetrackJournalEntrySchema = z.infer<typeof retrackJournalEntrySchema>
