import { z } from "zod";

//* -----------------------------
//* ENUMS
//* -----------------------------
export const IntakeTimeEnum = z.enum([
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "SNACKS"
], {
  error: "Bitte gebe eine Tageszeit an"
})


//* journal entry input data
export const journalEntrySchema = z.object({
  // used to discriminate which portion id field to use
  consumableId: z.string(),
  consumableType: z.literal(["FOOD", "MEAL"]),
  intakeTime: IntakeTimeEnum,
  daysToTrack: z
    .array(z.date())
    .min(1, "Mindestens einen Tag auswählen")
    .max(7, "Maximal 7 Tage auswählbar"),
  portionId: z.string(),
  portionName: z.string(), // will be added through "watch"
  portionGrams: z.number(), // will be added through "watch"
  portionAmount: z
    .number({ error: "Bitte Portionsmenge angeben" })
    .min(0, "Menge zu gering"),
})
