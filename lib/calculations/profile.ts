import {
  activityLevelValueMapping as activityLevelMapping,
  bodyFatValueMapping,
  fitnessGoalValueMapping as fitnessGoalMapping,
  noWorkoutValueMapping,
  waterGoalValueMapping as waterGoalMapping,
  workoutFactorMapping,
  workoutValueMapping
} from "@/schemas/mappings/profileSchemaMappings"
import { getAge } from "@/lib/utils"
import { MetricsProfileModel, NutritionResultModel } from "@/generated/prisma/models";


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

  const proteinGrams = +(weightKg * workoutValue * workoutFactor)
  const { proteinGramsMin, proteinGramsMax } = checkProteinRestrictions({ proteinGrams, weightKg })

  //* ensure proteins are in valid range
  const recommendedProteins = Math.max(Math.min(proteinGrams, proteinGramsMax), proteinGramsMin)
  return recommendedProteins
  // return +(recommendedProteins).toFixed(0)
}

//* recommended fats
export type CalculateRecommendedFatsProps = Pick<Required<MetricsProfileModel>, "weightKg" | "gender" | "bodyType">
export function calculateRecommendedFats({ weightKg, gender, bodyType }: CalculateRecommendedFatsProps) {
  const bodyFatValue = bodyFatValueMapping[gender][bodyType]

  const fatGrams = +(weightKg * bodyFatValue)
  const { fatGramsMin, fatGramsMax } = checkFatRestrictions({ fatGrams, weightKg, gender })

  //* ensure fats are in valid range
  const recommendedFats = Math.max(Math.min(fatGrams, fatGramsMax), fatGramsMin)
  return recommendedFats
  // return +(recommendedFats).toFixed(0)
}

//* recommended carbs
// Carbs are calculated with the remaining calories 
export type CalculateRecommendedCarbsProps = {
  calorieGoalInitial: ReturnType<typeof calculateCalorieGoal>
  recommendedProteins: number
  recommendedFats: number
}
export function calculateRecommendedCarbs({ calorieGoalInitial, recommendedProteins, recommendedFats }: CalculateRecommendedCarbsProps) {
  const carbGrams = (calorieGoalInitial - (recommendedProteins * 4) - (recommendedFats * 9)) / 4
  const { carbGramsMin } = checkCarbRestrictions({ carbGrams })

  //* ensure carbs are above min threshold
  const recommendedCarbs = Math.max(carbGramsMin, carbGrams)
  return recommendedCarbs
  // return +(recommendedCarbs).toFixed(0)
}


//* final calorieGoal
// Carbs are calculated with the remaining calories 
export type CalculateFinalCalorieGoalProps =
  Pick<NutritionResultModel,
    "proteinsMinGrams"
    | "proteinsMaxGrams"
    | "fatsMinGrams"
    | "fatsMaxGrams"
    | "carbsMinGrams"
    | "carbsMaxGrams"
  >
export function calculateFinalCalorieGoal({
  proteinsMinGrams, proteinsMaxGrams, fatsMinGrams, fatsMaxGrams, carbsMinGrams, carbsMaxGrams
}: CalculateFinalCalorieGoalProps) {
  const finalCalorieGoal = {
    min: (proteinsMaxGrams * 4) + (fatsMaxGrams * 9) + (carbsMaxGrams * 4), // use max grams for min
    max: (proteinsMinGrams * 4) + (fatsMinGrams * 9) + (carbsMinGrams * 4) // use min grams for max
  }
  return finalCalorieGoal
  // return +(finalCalorieGoal).toFixed(0)
}



//* proteins restrictions
// ideally proteins should be between two certain values to be optimal for that user
//? returns `true` if protein amount is "valid"
export type CheckProteinRestrictionsProps = Pick<Required<MetricsProfileModel>, "weightKg"> & {
  proteinGrams: number
}
export function checkProteinRestrictions({ weightKg, proteinGrams }: CheckProteinRestrictionsProps) {
  // grams per kg
  const proteinsMinConst = 1.4
  const proteinsMaxConst = 2.6

  const proteinsMin = weightKg * proteinsMinConst
  const proteinsMax = weightKg * proteinsMaxConst

  // functions should return the min/max amount for proteins and if proteins are in valid range
  const proteinRestrictions = {
    proteinGramsMin: proteinsMin,
    proteinGramsMax: proteinsMax,
    valid: proteinGrams >= proteinsMin && proteinGrams <= proteinsMax
  }

  return proteinRestrictions
}

//* fats restrictions
// a certain minimal amount of fat is essential to the average person
//? returns `true` if fats amount is "valid"
export type CheckFatRestrictionsProps = Pick<Required<MetricsProfileModel>, "weightKg" | "gender"> & {
  fatGrams: number
}
export function checkFatRestrictions({ weightKg, gender, fatGrams }: CheckFatRestrictionsProps) {
  // grams per kg
  const maleFatsMin = 0.6
  const femaleFatsMin = 0.7
  const maleFatsMax = 1.2
  const femaleFatsMax = 1.3

  //* functions should return the min/max amount for fats
  const fatRestrictions = {
    fatGramsMin: 0,
    fatGramsMax: 0,
    valid: false
  }

  //* determine gender differences for fats amount
  switch (gender) {
    case "MALE":
      fatRestrictions.fatGramsMin = weightKg * (maleFatsMin)
      fatRestrictions.fatGramsMax = weightKg * (maleFatsMax)
    case "FEMALE":
      fatRestrictions.fatGramsMin = weightKg * (femaleFatsMin)
      fatRestrictions.fatGramsMax = weightKg * (femaleFatsMax)
  }

  //* provide a "valid" prop which indicates if the fat restriction is met
  fatRestrictions.valid = fatGrams >= fatRestrictions.fatGramsMin && fatGrams <= fatRestrictions.fatGramsMax

  return fatRestrictions
}

//* carbs restrictions
// carbs are being calculated with the remaining calories after calculating the essential amounts of proteins and fats.
// Depending on the users profile data the recommended carbs could be below a certain threshold. We check if the threshold is met, else we consider that the calorie goal cannot be held healthy enough with the users profile data and prompt the user to change their fitnessGoal to get higher remaining calories (higher carbGrams)
//? returns `true` if carbs amount is "valid"
export type CheckCarbRestrictionsProps = {
  carbGrams: number
}
export function checkCarbRestrictions({ carbGrams }: CheckCarbRestrictionsProps) {
  //* as a general value we use 50 grams as the threshold. Carbs are not allowed to go below this threshold
  const carbsMin = 50 // grams

  // functions should return the min amount for carbs and if carbs are above threshold
  const carbRestrictions = {
    carbGramsMin: carbsMin,
    valid: carbGrams >= carbsMin
  }

  return carbRestrictions
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
