import { z } from "zod";


//* food input data
export const foodSchema = z.object({
  name: z.string().min(1, "Bitte Namen angeben"),
  brand: z.string().optional(),
  kcal: z
    .number({ error: "Bitte Kalorien angeben" })
    .min(0, "Menge zu gering"),
  fats: z
    .number({ error: "Bitte Fette angeben" })
    .min(0, "Menge zu gering")
    .max(100, "Menge zu groß"),
  carbs: z
    .number({ error: "Bitte KH angeben" })
    .min(0, "Menge zu gering")
    .max(100, "Menge zu groß"),
  protein: z
    .number({ error: "Bitte Proteine angeben" })
    .min(0, "Menge zu gering")
    .max(100, "Menge zu groß"),
})


//* food portions
export const foodPortionsSchema = z.array(
  z.object({
    name: z.string().min(1, "Bitte Namen angeben"),
    grams: z
      .number({ error: "Bitte Portion angeben" })
      .min(0, "Portion zu gering"),
    isDefault: z.boolean().default(false),
  })
)


export const foodWithPortionsSchema = z.object({
  food: foodSchema,
  portions: foodPortionsSchema
})

//* maybe us this?
// export const BodyDataStepSchema = z.object({
//   heightCm: z
//     .number({ error: "Bitte gib deine Körpergröße an" })
//     .min(100, "Körpergröße zu niedrig")
//     .max(250, "Körpergröße zu hoch"),
//   weightKg: z
//     .number({ error: "Bitte gib dein Gewicht an" })
//     .min(30, "Gewicht zu niedrig")
//     .max(250, "Gewicht zu hoch"),
//   trainingDaysPerWeek: z
//     .number({ error: "Bitte gib an, wie oft du trainierst" })
//     .int()
//     .min(0, "Mindestens 0 Trainingstage möglich")
//     .max(7, "Maximal 7 Trainingstage möglich"),
// })


//* use this to create a check, if the macro values add up to the calories
// export const MacroSplitsStepSchema = z.object({
//   useRecommended: z.boolean(),
//   fatSplit: z
//     .number({ error: "Bitte gib deinen Fettanteil an" })
//     .min(0)
//     .max(100),
//   carbSplit: z
//     .number({ error: "Bitte gib deinen Kohlenhydratanteil an" })
//     .min(0)
//     .max(100),
//   proteinSplit: z
//     .number({ error: "Bitte gib deinen Proteinanteil an" })
//     .min(0)
//     .max(100),
// }).refine(
//   (data) =>
//     data.fatSplit + data.carbSplit + data.proteinSplit === 100,
//   "Die Makronährstoffverteilung muss zusammen 100% ergeben"
// )
