import { ActivityLevel, FitnessGoal } from "@/generated/prisma/enums"
import {
  activityLevelValueMapping as activityLevelMap,
  bodyFatValueMapping,
  fitnessGoalValueMapping as fitnessGoalMap,
  noWorkoutValueMapping,
  waterGoalValueMapping as waterGoalMap,
  waterGoalValueMapping,
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

  const { min, max } =
    trainingDaysPerWeek > 0
      ? workoutValueMapping[fitnessGoal]
      : noWorkoutValueMapping[fitnessGoal]

  return { min, max, workoutFactor }
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
  const tdee = bmr * activityLevelMap[activityLevel]
  return tdee
  // return +(tdee).toFixed(0)
}


//* CalorieGoal
export type CalculateCalorieGoalProps = Pick<Required<MetricsProfileModel>, "fitnessGoal"> & {
  tdee: ReturnType<typeof calculateTDEE>
}
export function calculateCalorieGoal({ tdee, fitnessGoal }: CalculateCalorieGoalProps) {
  const calorieGoal = tdee * fitnessGoalMap[fitnessGoal]
  return calorieGoal
  // return +(calorieGoal).toFixed(0)
}


//* WaterDemand
export type CalculateWaterDemandProps = Pick<Required<MetricsProfileModel>, "weightKg" | "fitnessGoal" | "activityLevel" | "trainingDaysPerWeek">
export function calculateWaterDemand({ weightKg, activityLevel, fitnessGoal, trainingDaysPerWeek }: CalculateWaterDemandProps) {
  // mappings
  const { min: minWorkoutValue, max: maxWorkoutValue } = getWorkoutValuesAndFactor({ fitnessGoal, trainingDaysPerWeek })
  const activityMap = activityLevelMap[activityLevel]
  const waterGoalMap = waterGoalValueMapping[fitnessGoal]

  // calculation factors
  const waterBaseMl = weightKg * 35
  const activityFactor = Math.max((activityMap - 1), 0) * 0.6 + 1 // at least 1
  const proteinFactorMin = 1 + (Math.max(minWorkoutValue, 1.6) * 0.04) // × Protein_Faktor
  const proteinFactorMax = 1 + (Math.max(maxWorkoutValue, 1.6) * 0.04) // × Protein_Faktor

  // min/max range
  const waterDemandBase = waterBaseMl * activityFactor * waterGoalMap
  const min = (waterDemandBase * proteinFactorMin)
  const max = (waterDemandBase * proteinFactorMax)

  return { min, max }
  // return +(WaterDemand).toFixed(0)
}


//* recommended proteins
export type CalculateRecommendedProteinsProps = Pick<Required<MetricsProfileModel>, "weightKg" | "fitnessGoal" | "trainingDaysPerWeek">
export function calculateRecommendedProteins({ weightKg, fitnessGoal, trainingDaysPerWeek }: CalculateRecommendedProteinsProps) {
  const { min: minWorkoutValue, max: maxWorkoutValue, workoutFactor } = getWorkoutValuesAndFactor({ fitnessGoal, trainingDaysPerWeek })

  const calcFactorMin = minWorkoutValue * workoutFactor
  const calcFactorMax = maxWorkoutValue * workoutFactor
  const min = +(weightKg * calcFactorMin)
  const max = +(weightKg * calcFactorMax)

  return { min, max }
  // return +(recommendedProteins).toFixed(0)
}

//* recommended fats
export type CalculateRecommendedFatsProps = Pick<Required<MetricsProfileModel>, "weightKg" | "gender" | "bodyType">
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
// Depending on the users body data the recommended carbs could be below a certain threshold. We check if the threshold is met, else we consider that the calorie goal cannot be held healthy enough with the users body data
//? returns `true` if carbs amount is "valid"
export type CheckCarbRestrictionsProps = {
  carbGrams: number
}
export function checkCarbRestrictions({ carbGrams }: CheckCarbRestrictionsProps) {
  const carbsMin = 50 // grams

  //* as a general value we use 50 grams as the threshold. Since macro values are being calculated into a min and max value we create the average of the min carbs and max carbs to compare one value to another. Average should be higher than the general minimum
  return carbGrams > carbsMin
}
