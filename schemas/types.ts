import { ActivityLevel, BodyType, FitnessGoal, Gender } from "@/generated/prisma/enums";
import { z } from "zod";
import { foodWithPortionsSchema } from "./food/foodSchema";
import { activityLevelValueMapping, bodyFatPercentageValueMapping, fitnessGoalValueMapping } from "./mappings/profileSchemaMappings";
import { mergedProfileSchema, profileSchema } from "./profileSchema";
import { journalEntrySchema } from "./journal/journalEntrySchema";

// Schemas
export type ProfileSchema = z.infer<typeof profileSchema>
export type FlatProfileSchema = z.infer<typeof mergedProfileSchema>

export type MappedFlatProfileSchema = Omit<Required<FlatProfileSchema>, "bodyType" | "fitnessGoal" | "activityLevel"> & {
  kfaMap: typeof bodyFatPercentageValueMapping[Gender][BodyType]
  activityMap: typeof activityLevelValueMapping[ActivityLevel]
  fitnGoalMap: typeof fitnessGoalValueMapping[FitnessGoal]
}

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
