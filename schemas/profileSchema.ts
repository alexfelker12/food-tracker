import { z } from "zod";

//* -----------------------------
//* ENUMS
//* -----------------------------
export const GenderEnum = z.enum([
  "MALE",
  "FEMALE"
], {
  error: "Bitte gebe dein Geschlecht an"
})
export const FitnessGoalEnum = z.enum([
  "QUICKLY_LOSE_WEIGHT",
  "LOSE_WEIGHT",
  "MAINTAIN",
  "GAIN_WEIGHT",
  "QUICKLY_GAIN_WEIGHT",
], {
  error: "Bitte wähle dein Ziel aus"
})
export const ActivityLevelEnum = z.enum([
  "VERY_LOW",
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
], {
  error: "Bitte gebe dein Aktivitätslevel an"
})
export const BodyTypeEnum = z.enum([
  "VERY_ATHLETIC",
  "ATHLETIC",
  "AVERAGE",
  "SLIGHTLY_OVERWEIGHT",
  "MORE_OVERWEIGHT",
], {
  error: "Bitte wähle einen Körpertyp aus"
})


//* STEP — user data
export const UserDataStepSchema = z.object({
  birthDate: z.preprocess(
    (val) => val === null ? undefined : val,
    z.coerce.date<Date>({
      error: "Gebe bitte dein Geburtsdatum an"
    })
  ),
  gender: GenderEnum,
})


//* STEP — body data
export const BodyDataStepSchema = z.object({
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


//* STEP — Fitness Profile
export const FitnessProfileStepSchema = z.object({
  fitnessGoal: FitnessGoalEnum,
  activityLevel: ActivityLevelEnum,
  trainingDaysPerWeek: z
    .number({ error: "Bitte gib an, wie oft du trainierst" })
    .int()
    .min(0, "Mindestens 0 Trainingstage möglich")
    .max(7, "Maximal 7 Trainingstage möglich"),
})


//* STEP — Macro Splits
export const MacroSplitsStepSchema = z.object({
  useRecommended: z.boolean(),
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
//! order of keys determines internal step order
export const profileSchema = z.object({
  userDataStep: UserDataStepSchema, //! step 1
  bodyDataStep: BodyDataStepSchema, //! step 2
  fitnessProfileStep: FitnessProfileStepSchema, //! step 3
  macroSplitStep: MacroSplitsStepSchema, //! step 4
})

// export const requiredProfileSchema = z.object({
//   userDataStep: UserDataStepSchema
//     .refine((data) =>)
//   ,
//   bodyDataStep: BodyDataStepSchema,
//   fitnessProfileStep: FitnessProfileStepSchema,
//   macroSplitStep: MacroSplitsStepSchema,
// })



export const mergedProfileSchema = UserDataStepSchema
  .extend(BodyDataStepSchema.shape)
  .extend(FitnessProfileStepSchema.shape)
  .extend(MacroSplitsStepSchema.shape)

//? to validate flatten form, validate like this:
// mergedProfileSchema.parse({
//   ...formData.userDataStep,
//   ...formData.bodyDataStep,
//   ...formData.fitnessProfileStep,
//   ...formData.macroSplitStep,
// })
