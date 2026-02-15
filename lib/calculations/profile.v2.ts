import {
  activityLevelValueMapping as activityLevelMapping,
  bodyFatValueMapping,
  fitnessGoalValueMapping as fitnessGoalMapping,
  noWorkoutValueMapping,
  waterGoalValueMapping as waterGoalMapping,
  workoutFactorMapping,
  workoutValueMapping
} from "@/schemas/mappings/profileSchemaMappings.v2"
import { getAge } from "@/lib/utils"
import { MetricsProfileModel } from "@/generated/prisma/models";


//* -----------------------------
//* HELPER FUNCTIONS
//* -----------------------------

export type GetWorkoutValuesAndFactorProps = Pick<Required<MetricsProfileModel>, "fitnessGoal" | "trainingDaysPerWeek">
function getWorkoutValuesAndFactor({ fitnessGoal, trainingDaysPerWeek }: GetWorkoutValuesAndFactorProps) {
  const workoutFactor = workoutFactorMapping[trainingDaysPerWeek]

  const workoutValue = trainingDaysPerWeek > 0
    ? workoutValueMapping[fitnessGoal]
    : noWorkoutValueMapping[fitnessGoal]

  return { workoutValue, workoutFactor }
}

//* -----------------------------
//* MAIN CALCULATIONS
//* -----------------------------

//* BMR
export type CalculateBMRProps = Pick<Required<MetricsProfileModel>, "gender" | "weightKg" | "heightCm" | "birthDate">
export function calculateBMR({ gender, weightKg, heightCm, birthDate }: CalculateBMRProps) {
  const age = getAge(birthDate)
  const genderDiff = gender === "MALE" ? 5 : -161
  const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + genderDiff
  return bmr
  // return +(bmr).toFixed(0)
}


//* TDEE
export type CalculateTDEEProps = Pick<Required<MetricsProfileModel>, "activityLevel"> & {
  bmr: ReturnType<typeof calculateBMR>
}
export function calculateTDEE({ bmr, activityLevel }: CalculateTDEEProps) {
  const tdee = bmr * activityLevelMapping[activityLevel]
  return tdee
  // return +(tdee).toFixed(0)
}


//* CalorieGoal
export type CalculateCalorieGoalProps = Pick<Required<MetricsProfileModel>, "fitnessGoal"> & {
  tdee: ReturnType<typeof calculateTDEE>
}
export function calculateCalorieGoal({ tdee, fitnessGoal }: CalculateCalorieGoalProps) {
  const calorieGoal = tdee * fitnessGoalMapping[fitnessGoal]
  return calorieGoal
  // return +(calorieGoal).toFixed(0)
}


//* WaterDemand
export type CalculateWaterDemandProps = Pick<Required<MetricsProfileModel>, "weightKg" | "fitnessGoal" | "activityLevel" | "trainingDaysPerWeek">
export function calculateWaterDemand({ weightKg, activityLevel, fitnessGoal, trainingDaysPerWeek }: CalculateWaterDemandProps) {
  // mappings
  const { workoutValue } = getWorkoutValuesAndFactor({ fitnessGoal, trainingDaysPerWeek })
  const activityMap = activityLevelMapping[activityLevel]
  const waterGoalMap = waterGoalMapping[fitnessGoal]

  // calculation factors
  const waterBaseMl = weightKg * 35
  const activityFactor = Math.max((activityMap - 1), 0) * 0.6 + 1 // at least 1
  const proteinFactor = 1 + (Math.max(workoutValue, 1.6) * 0.04) // × Protein_Faktor

  // min/max range
  const waterDemandBase = waterBaseMl * activityFactor * waterGoalMap
  const waterDemand = (waterDemandBase * proteinFactor)

  const minMaxWaterDemand = getMinMaxRange(waterDemand)
  return minMaxWaterDemand
  // return +(WaterDemand).toFixed(0)
}


//* recommended proteins
export type CalculateRecommendedProteinsProps = Pick<Required<MetricsProfileModel>, "weightKg" | "fitnessGoal" | "trainingDaysPerWeek">
export function calculateRecommendedProteins({ weightKg, fitnessGoal, trainingDaysPerWeek }: CalculateRecommendedProteinsProps) {
  const { workoutValue, workoutFactor } = getWorkoutValuesAndFactor({ fitnessGoal, trainingDaysPerWeek })

  const recommendedProteins = +(weightKg * workoutValue * workoutFactor)
  return recommendedProteins
  // return +(recommendedProteins).toFixed(0)
}

//* recommended fats
export type CalculateRecommendedFatsProps = Pick<Required<MetricsProfileModel>, "weightKg" | "gender" | "bodyType">
export function calculateRecommendedFats({ weightKg, gender, bodyType }: CalculateRecommendedFatsProps) {
  const bodyFatValue = bodyFatValueMapping[gender][bodyType]

  const recommendedFats = +(weightKg * bodyFatValue)
  return recommendedFats
  // return +(recommendedFats).toFixed(0)
}


//* recommended carbs
// Carbs are calculated with the remaining calories 
export type CalculateRecommendedCarbsProps = {
  calorieGoal: ReturnType<typeof calculateCalorieGoal>
  recommendedProteins: number
  recommendedFats: number
}
export function calculateRecommendedCarbs({ calorieGoal, recommendedProteins, recommendedFats }: CalculateRecommendedCarbsProps) {
  const recommendedCarbs = (calorieGoal - (recommendedProteins * 4) - (recommendedFats * 9)) / 4
  return recommendedCarbs
  // return +(recommendedCarbs).toFixed(0)
}


//* proteins restrictions
// ideally proteins should be between two certain values to be optimal for that user
//? returns `true` if protein amount is "valid"
export type CheckProteinRestrictionsProps = Pick<Required<MetricsProfileModel>, "weightKg"> & {
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
export type CheckFatRestrictionsProps = Pick<Required<MetricsProfileModel>, "weightKg" | "gender"> & {
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
// Depending on the users profile data the recommended carbs could be below a certain threshold. We check if the threshold is met, else we consider that the calorie goal cannot be held healthy enough with the users profile data
//? returns `true` if carbs amount is "valid"
export type CheckCarbRestrictionsProps = {
  carbGrams: number
}
export function checkCarbRestrictions({ carbGrams }: CheckCarbRestrictionsProps) {
  const carbsMin = 50 // grams

  //* as a general value we use 50 grams as the threshold. Carbs are not allowed to go below this threshold
  return carbGrams > carbsMin
}


/**
 * creates a min/max range from a target value
 * @param targetValue :number, value to create min/max range from
 * @param minMaxRangePercentage :number, min/max range multiplicator. Percentage value -> default 0.05 
 */
export function getMinMaxRange(targetValue: number, minMaxRangePercentage: number = 0.05) {
  const min = targetValue * (1 - minMaxRangePercentage) // <- with default: 1 - 0.05 = 0.95
  const max = targetValue * (1 + minMaxRangePercentage) // <- with default: 1 + 0.05 = 1.05
  return { min, max }
}
