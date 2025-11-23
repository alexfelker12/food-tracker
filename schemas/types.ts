import { z } from "zod";
import { ActivityLevelEnum, BodyTypeEnum, FitnessGoalEnum, GenderEnum, mergedProfileSchema, profileSchema } from "./profileSchema"
import { activityLevelValueMapping, bodyFatPercentageValueMapping, fitnessGoalValueMapping } from "./mappings/profileSchemaMappings";
import { foodWithPortionsSchema } from "./food/foodSchema";

// Schemas
export type ProfileSchema = z.infer<typeof profileSchema>
export type FlatProfileSchema = z.infer<typeof mergedProfileSchema>

export type MappedFlatProfileSchema = Omit<Required<FlatProfileSchema>, "bodyType" | "fitnessGoal" | "activityLevel"> & {
  kfaMap: typeof bodyFatPercentageValueMapping[GenderEnumKeys][BodyTypeEnumKeys]
  activityMap: typeof activityLevelValueMapping[ActivityLevelEnumKeys]
  fitnGoalMap: typeof fitnessGoalValueMapping[FitnessGoalEnumKeys]
}


// FieldKeys
export type GenderEnumKeys = typeof GenderEnum.enum[keyof typeof GenderEnum.enum]
export type ActivityLevelEnumKeys = typeof ActivityLevelEnum.enum[keyof typeof ActivityLevelEnum.enum]
export type FitnessGoalEnumKeys = typeof FitnessGoalEnum.enum[keyof typeof FitnessGoalEnum.enum]
export type BodyTypeEnumKeys = typeof BodyTypeEnum.enum[keyof typeof BodyTypeEnum.enum]

// misc
export type MacroSplits = {
  fatSplit: number
  carbSplit: number
  proteinSplit: number
}

// Food
export type FoodWithPortionsSchema = z.infer<typeof foodWithPortionsSchema>
