import { ActivityLevel, FitnessGoal } from "@/generated/prisma/enums"

import {
  activityLevelValueMapping as activityMap,
  fitnessGoalValueMapping as fitnGoalMap,
  bodyFatValueMapping,
  noWorkoutValueMapping,
  workoutFactorMapping,
  workoutValueMapping
} from "@/schemas/mappings/profileSchemaMappings.v2"
import {
  bodyFatPercentageValueMapping as kfaMap, // body fat percentage map
} from "@/schemas/mappings/profileSchemaMappings"
import type {
  FlatProfileSchema,
  MappedFlatProfileSchema
} from "@/schemas/types"

import { getAge } from "@/lib/utils"


// example values to validate calculations
export const testData: Required<FlatProfileSchema> = {
  gender: "MALE",
  birthDate: new Date("1997-30-07"),
  heightCm: 184,
  weightKg: 85,
  bodyType: "SLIGHTLY_OVERWEIGHT",
  fitnessGoal: "QUICKLY_LOSE_WEIGHT",
  activityLevel: "LOW",
  trainingDaysPerWeek: 2,
  fatSplit: 22,
  carbSplit: 41,
  proteinSplit: 37,
  useRecommended: false
}

const gender = testData["gender"]
const bodyType = testData["bodyType"]
export const mappedTestData: MappedFlatProfileSchema = {
  gender: gender, // Geschlecht
  birthDate: testData["birthDate"], // Alter (Jahre)
  heightCm: testData["heightCm"], // Größe (cm)
  weightKg: testData["weightKg"], // Gewicht (kg)
  fitnGoalMap: fitnGoalMap[testData["fitnessGoal"]], // Ziel
  activityMap: activityMap[testData["activityLevel"]], // Aktivität
  trainingDaysPerWeek: testData["trainingDaysPerWeek"], // Trainingstage/Woche
  kfaMap: kfaMap[gender][bodyType], // KFA (estimated from bodyType and age)
  proteinSplit: testData["proteinSplit"], // % of 100%
  fatSplit: testData["fatSplit"], // % of 100%
  carbSplit: testData["carbSplit"], // % of 100%
  useRecommended: testData["useRecommended"]
}



//* -----------------------------
//* MAIN CALCULATIONS
//* -----------------------------

//* BMR
export type CalculateBMRProps = Pick<Required<FlatProfileSchema>, "gender" | "weightKg" | "heightCm" | "birthDate">
export function calculateBMR({ gender, weightKg, heightCm, birthDate }: CalculateBMRProps) {
  const age = getAge(birthDate)
  const ageDiff = gender === "MALE" ? 5 : -161
  const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + ageDiff
  return bmr
  // return +(bmr).toFixed(0)
}


//* TDEE
// Pick<Required<FlatProfileSchema>, "activityLevel"> & 
export type CalculateTDEEProps = {
  bmr: ReturnType<typeof calculateBMR>
  activityMap: typeof activityMap[ActivityLevel]
}
export function calculateTDEE({ bmr, activityMap }: CalculateTDEEProps) {
  const tdee = bmr * activityMap
  return tdee
  // return +(tdee).toFixed(0)
}


//* CalorieGoal
export type CalculateCalorieGoalProps = {
  tdee: ReturnType<typeof calculateTDEE>
  fitnGoalMap: typeof fitnGoalMap[FitnessGoal]
}
export function calculateCalorieGoal({ tdee, fitnGoalMap }: CalculateCalorieGoalProps) {
  const calorieGoal = tdee * fitnGoalMap
  return calorieGoal
  // return +(calorieGoal).toFixed(0)
}


//* recommended proteins
export type CalculateRecommendedProteinsProps = Pick<Required<FlatProfileSchema>, "weightKg" | "fitnessGoal" | "trainingDaysPerWeek">
export function calculateRecommendedProteins({ weightKg, fitnessGoal, trainingDaysPerWeek }: CalculateRecommendedProteinsProps) {
  let minValue = 0
  let maxValue = 0
  let workoutFactor = 1 // TODO: Discuss base factor (1 & 2 trainingDays are < 1)

  if (trainingDaysPerWeek > 0) {
    //* workout values
    const { min, max } = workoutValueMapping[fitnessGoal]
    minValue = min
    maxValue = max
    workoutFactor = workoutFactorMapping[trainingDaysPerWeek] // includes workout factor when user has at least one training day
  } else {
    //* no workout values
    const { min, max } = noWorkoutValueMapping[fitnessGoal]
    minValue = min
    maxValue = max
  }

  const calcFactorMin = minValue * workoutFactor
  const calcFactorMax = maxValue * workoutFactor
  const min = +(weightKg * calcFactorMin)
  const max = +(weightKg * calcFactorMax)
  return { min, max }
  // return +(recommendedProteins).toFixed(0)
}

//* recommended fats
export type CalculateRecommendedFatsProps = Pick<Required<FlatProfileSchema>, "weightKg" | "gender" | "bodyType">
export function calculateRecommendedFats({ weightKg, gender, bodyType }: CalculateRecommendedFatsProps) {
  const { min: minFats, max: maxFats } = bodyFatValueMapping[gender][bodyType]
  const min = +(weightKg * minFats)
  const max = +(weightKg * maxFats)
  return { min, max }
  // return +(recommendedFats).toFixed(0)
}


//* recommended carbs
// Carbs are calculated with the remaining calories 
export type CalculateRecommendedCarbsProps = {
  calorieGoal: ReturnType<typeof calculateCalorieGoal>
  recommendedProteins: ReturnType<typeof calculateRecommendedProteins>
  recommendedFats: ReturnType<typeof calculateRecommendedFats>
}
export function calculateRecommendedCarbs({ calorieGoal, recommendedProteins, recommendedFats }: CalculateRecommendedCarbsProps) {
  const { min: minRecommendedProteins, max: maxRecommendedProteins } = recommendedProteins
  const { min: minRecommendedFats, max: maxRecommendedFats } = recommendedFats

  const proteinCaloriesMin = minRecommendedProteins * 4
  const proteinCaloriesMax = maxRecommendedProteins * 4
  const fatCaloriesMin = minRecommendedFats * 9
  const fatCaloriesMax = maxRecommendedFats * 9

  const minRemainingCalories = calorieGoal - proteinCaloriesMin - fatCaloriesMin
  const maxRemainingCalories = calorieGoal - proteinCaloriesMax - fatCaloriesMax
  const min = minRemainingCalories / 4
  const max = maxRemainingCalories / 4
  return { min, max }
  // return +(recommendedCarbs).toFixed(0)
}


//* proteins restrictions
// ideally proteins should be between two certain values to optimal for that user
//? returns `true` if protein amount is "valid"
export type CheckProteinRestrictionsProps = Pick<Required<FlatProfileSchema>, "weightKg"> & {
  proteinGrams: number
}
export function checkProteinRestrictions({ weightKg, proteinGrams }: CheckProteinRestrictionsProps) {
  const proteinsMinConst = 1.4 // grams per kg
  const proteinsMaxConst = 2.6 // grams per kg
  const proteinsMin = weightKg * proteinsMinConst
  const proteinsMax = weightKg * proteinsMaxConst
  //* between 1.4 g/kg and 2.6 g/kg
  return proteinGrams >= proteinsMin && proteinGrams <= proteinsMax
}

//* fats restrictions
// a certain minimal amount of fat is essential to the average person
//? returns `true` if fats amount is "valid"
export type CheckFatRestrictionsProps = Pick<Required<FlatProfileSchema>, "weightKg" | "gender"> & {
  fatGrams: number
}
export function checkFatRestrictions({ weightKg, gender, fatGrams }: CheckFatRestrictionsProps) {
  const maleFatsMin = 0.6 // grams per kg
  const femaleFatsMin = 0.7 // grams per kg
  //* at least 0.6 or 0.7 g/kg depending on the users gender
  const fatGramsMin = weightKg * (gender === "MALE" ? maleFatsMin : femaleFatsMin)
  return fatGrams > fatGramsMin
}

//* carbs restrictions
// carbs are being calculated with the remaining calories after calculating the essential amounts of proteins and fats.
// Depending on the users body data the recommended carbs could be below a certain threshold. We check if the threshold is met, else we consider that the calorie goal cannot be held healthy enough with the users body data
//? returns `true` if carbs amount is "valid"
export type CheckCarbRestrictionsProps = {
  recommendedCarbs: ReturnType<typeof calculateRecommendedCarbs>
}
export function checkCarbRestrictions({ recommendedCarbs: { min, max } }: CheckCarbRestrictionsProps) {
  const carbsMin = 50 // grams
  const carbsMedian = (min + max) / 2
  //* as a general value we use 50 grams as the threshold. Since macro values are being calculated into a min and max value we create the median of the min carbs and max carbs to compare one value to another. Median should be higher than the general minimum
  return carbsMedian > carbsMin
}
