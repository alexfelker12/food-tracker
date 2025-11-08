// "use server"

// TODO: adjust calcs to derive age from new birthDate field
// TODO: heightCm and age are not used -> discuss

import {
  activityLevelValueMapping as activityMap,
  fitnessGoalValueMapping as fitnGoalMap,
  bodyFatPercentageValueMapping as kfaMap, // body fat percentage map
  recommendedBaseSplitsMapping
} from "@/schemas/mappings/profileSchemaMappings"
import type {
  ActivityLevelEnumKeys,
  BodyTypeEnumKeys,
  FitnessGoalEnumKeys,
  FlatProfileSchema,
  GenderEnumKeys,
  MacroSplits,
  MappedFlatProfileSchema
} from "@/schemas/types"


// example values to validate calculations
export const testData: Required<FlatProfileSchema> = {
  gender: "MALE",
  birthDate: null,
  heightCm: 184,
  weightKg: 85,
  bodyType: "SLIGHTLY_OVERWEIGHT",
  fitnessGoal: "QUICKLY_LOSE_WEIGHT",
  activityLevel: "LOW",
  trainingDaysPerWeek: 2,
  fatSplit: 22,
  carbSplit: 41,
  proteinSplit: 37,
  useRecommended: true
}

// excel cell names
const B3 = testData["gender"]  // Geschlecht
const B4 = testData["birthDate"]  // Alter (Jahre)
const B5 = testData["heightCm"]  // Größe (cm)
const B6 = testData["weightKg"]  // Gewicht (kg)
const B7 = testData["bodyType"]  // Körpertyp
const B8 = fitnGoalMap[testData["fitnessGoal"]]  // Ziel
const B9 = activityMap[testData["activityLevel"]]  // Aktivität
const B10 = testData["trainingDaysPerWeek"]  // Trainingstage/Woche
const B11 = kfaMap[B3][B7]  // KFA (estimated from bodyType and age)
const B18 = testData["proteinSplit"]  // Trainingstage/Woche
const B19 = testData["fatSplit"]  // Trainingstage/Woche
const B20 = testData["carbSplit"]  // Trainingstage/Woche

export const mappedTestData: MappedFlatProfileSchema = {
  gender: B3,
  birthDate: B4,
  heightCm: B5,
  weightKg: B6,
  fitnGoalMap: B8,
  activityMap: B9,
  trainingDaysPerWeek: B10,
  kfaMap: B11,
  proteinSplit: B18,
  fatSplit: B19,
  carbSplit: B20,
  useRecommended: true
}



//* -----------------------------
//* MAIN CALCULATIONS
//* -----------------------------

//* BMR
export type CalculateBMRProps = Pick<Required<FlatProfileSchema>, "weightKg"> & {
  kfaMap: typeof kfaMap[GenderEnumKeys][BodyTypeEnumKeys]
}
export function calculateBMR({ weightKg, kfaMap }: CalculateBMRProps) {
  return +(370 + 21.6 * (weightKg * (1 - kfaMap / 100))).toFixed(2)
}


//* TDEE
export type CalculateTDEEProps = Pick<Required<FlatProfileSchema>, "trainingDaysPerWeek"> & {
  activityMap: typeof activityMap[ActivityLevelEnumKeys]
  bmr: ReturnType<typeof calculateBMR>
  tefQuota: ReturnType<typeof calculateTEFQuota>
}
export function calculateTDEE({ trainingDaysPerWeek, activityMap, bmr, tefQuota }: CalculateTDEEProps) {
  return +((bmr * activityMap + (trainingDaysPerWeek * 300 / 7)) * (1 + tefQuota)).toFixed(0)
}


//* CaloryGoal
export type CalculateCaloryGoalProps = {
  fitnGoalMap: typeof fitnGoalMap[FitnessGoalEnumKeys]
  tdee: ReturnType<typeof calculateTDEE>
}
export function calculateCaloryGoal({ fitnGoalMap, tdee }: CalculateCaloryGoalProps) {
  return +(tdee * fitnGoalMap).toFixed(0)
}


//* TEFQuota
export type CalculateTEFQuotaProps = Pick<Required<FlatProfileSchema>, "fatSplit" | "carbSplit" | "proteinSplit"> & {
  normalizePercent?: boolean
}
export function calculateTEFQuota({ fatSplit, carbSplit, proteinSplit, normalizePercent = false }: CalculateTEFQuotaProps) {
  const tefQuota = 0.2 * (proteinSplit / 100) + 0.03 * (fatSplit / 100) + 0.08 * (carbSplit / 100)
  return normalizePercent ? +(tefQuota * 100).toFixed(2) : +tefQuota.toFixed(4)
}


//* DefizitOrSurplus
export type CalculateDefizitOrSurplusProps = {
  caloryGoal: ReturnType<typeof calculateCaloryGoal>
  tdee: ReturnType<typeof calculateTDEE>
}
export function calculateDefizitOrSurplus({ caloryGoal, tdee }: CalculateDefizitOrSurplusProps) {
  return +(caloryGoal - tdee).toFixed(0)
}


//* TotalSplitValues
export type CalculateTotalSplitValuesProps = Pick<Required<FlatProfileSchema>, "fatSplit" | "carbSplit" | "proteinSplit"> & {
  caloryGoal: ReturnType<typeof calculateCaloryGoal>
}
export function calculateTotalSplitValues({ caloryGoal, fatSplit, carbSplit, proteinSplit }: CalculateTotalSplitValuesProps) {
  return {
    fatSplit: ((caloryGoal * (fatSplit / 100)) / 9),
    carbSplit: ((caloryGoal * (carbSplit / 100)) / 4),
    proteinSplit: ((caloryGoal * (proteinSplit / 100)) / 4)
  }
}


//* RecommendedSplitsByBodyType
export type calculateRecommendedBodyTypeSplitsProps = Pick<Required<FlatProfileSchema>, "fitnessGoal" | "bodyType">
export function calculateRecommendedSplitsByBodyType({ bodyType, fitnessGoal }: calculateRecommendedBodyTypeSplitsProps): MacroSplits {
  const baseMapping = recommendedBaseSplitsMapping[fitnessGoal]

  switch (bodyType) {
    // adjust carbs and fats
    case "VERY_ATHLETIC":
    case "ATHLETIC":
      return {
        fatSplit: baseMapping.fatSplit - 5,
        carbSplit: baseMapping.carbSplit + 5,
        proteinSplit: baseMapping.proteinSplit,
      }
    // leave as is
    case "AVERAGE":
      return baseMapping
    // adjust carbs and proteins
    case "SLIGHTLY_OVERWEIGHT":
    case "MORE_OVERWEIGHT":
      return {
        fatSplit: baseMapping.fatSplit,
        carbSplit: baseMapping.carbSplit - 5,
        proteinSplit: baseMapping.proteinSplit + 5,
      }
  }
}


//* WaterDemand
export type CalculateWaterDemandProps = Pick<Required<FlatProfileSchema>, "weightKg" | "trainingDaysPerWeek">
export function calculateWaterDemand({ weightKg, trainingDaysPerWeek }: CalculateWaterDemandProps) {
  return +(weightKg * 0.035 + trainingDaysPerWeek * 0.3).toFixed(1)
}
