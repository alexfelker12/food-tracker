import { z } from "zod";

//* -----------------------------
//* ENUMS
//* -----------------------------
export const GenderEnum = z.enum([
  "MALE",
  "FEMALE"
])
export const FitnessGoalEnum = z.enum([
  "QUICKLY_LOSE_WEIGHT",
  "LOSE_WEIGHT",
  "MAINTAIN",
  "GAIN_WEIGHT",
  "QUICKLY_GAIN_WEIGHT",
])
export const ActivityLevelEnum = z.enum([
  "VERY_LOW",
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
])
export const BodyTypeEnum = z.enum([
  "VERY_ATHELTIC",
  "ATHELTIC",
  "AVERAGE",
  "SLIGHTLY_OVERWEIGHT",
  "MORE_OVERWEIGHT",
])


//* STEP 1 — body data
export const Step1Schema = z.object({
  gender: GenderEnum,
  age: z
    .number({ error: "Bitte gib dein Alter an" })
    .int()
    .min(12, "Das Mindestalter ist 12 Jahre")
    .max(99, "Das Höchstalter ist 99 Jahre"),
  heightCm: z
    .number({ error: "Bitte gib deine Körpergröße an" })
    .min(100, "Körpergröße zu niedrig")
    .max(250, "Körpergröße zu hoch"),
  weightKg: z
    .number({ error: "Bitte gib dein Gewicht an" })
    .min(30, "Gewicht zu niedrig")
    .max(250, "Gewicht zu hoch"),
  bodyType: BodyTypeEnum,
})


//* STEP 2 — Fitness Profile
export const Step2Schema = z.object({
  fitnessGoal: FitnessGoalEnum,
  activityLevel: ActivityLevelEnum,
  trainingDaysPerWeek: z
    .number({ error: "Bitte gib an, wie oft du trainierst" })
    .int()
    .min(0, "Mindestens 0 Trainingstage möglich")
    .max(7, "Maximal 7 Trainingstage möglich"),
})


//* STEP 3 — Macro Splits
export const Step3Schema = z.object({
  fatSplit: z
    .number({ error: "Bitte gib deinen Fettanteil an" })
    .min(0)
    .max(100),
  carbSplit: z
    .number({ error: "Bitte gib deinen Kohlenhydratanteil an" })
    .min(0)
    .max(100),
  proteinSplit: z
    .number({ error: "Bitte gib deinen Proteinanteil an" })
    .min(0)
    .max(100),
}).refine(
  (data) =>
    data.fatSplit + data.carbSplit + data.proteinSplit === 100,
  "Die Makronährstoffverteilung muss zusammen 100% ergeben"
)


//* combined (steps-) schema
export const profileSchema = z.object({
  step1: Step1Schema,
  step2: Step2Schema,
  step3: Step3Schema,
})

export type ProfileSchema = z.infer<typeof profileSchema>


//? to validate flatten form, validate like this:
// export const mergedProfileSchema = Step1Schema
//   .extend(Step2Schema.shape)
//   .extend(Step3Schema.shape)
//
// mergedProfileSchema.parse({
//   ...formData.step1,
//   ...formData.step2,
//   ...formData.step3,
// })

