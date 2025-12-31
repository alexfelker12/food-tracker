import { z } from "zod";


//* food input data
export const foodSchema = z.object({
  name: z
    .string()
    .min(1, "Bitte Namen angeben")
    .transform((name) => name.trim()),
  brand: z
    .string()
    .optional()
    .transform((brand) => brand && brand.trim()),
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
//? add this sometime, to ensure macro values correctly add up the the provided calories / 100g
// .refine(
//   (data) => {
//     const kcalSum = (data.fats * 9) + (data.carbs * 4) + (data.protein * 4)
//     //* check if macro values add up to calories with a 3 kcal tolerance
//     return (data.kcal < kcalSum + 3) && (data.kcal > kcalSum - 3)
//   },
//   "Die Makronährstoffsumme weicht von der angegebenen Kalorien-Zahl ab"
// )

//* food portions
export const foodPortionsSchema = z.array(
  z.object({
    name: z
      .string()
      .min(1, "Bitte Namen angeben")
      .transform((name) => name.trim()),
    grams: z
      .number({ error: "Bitte Portion angeben" })
      .min(0, "Portion zu gering"),
    isDefault: z
      .boolean()
      .default(false),
  })
)

//* food portions
export const foodBarcodesSchema = z.array(
  z.object({
    barcode: z
      .string()
      .min(1, "Barcode darf nicht leer sein")
      .transform((name) => name.trim()),
  })
)


export const foodWithPortionsSchema = z.object({
  food: foodSchema,
  portions: foodPortionsSchema,
  barcodes: foodBarcodesSchema
})


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
