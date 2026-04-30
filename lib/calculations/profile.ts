import {
  activityLevelValueMapping as activityLevelMapping,
  activityWaterValueMapping,
  bodyFatValueMapping,
  fitnessGoalValueMapping as fitnessGoalMapping,
  noWorkoutValueMapping,
  bodyTypeValueMapping as bodyTypeMapping,
  workoutFactorMapping,
  workoutValueMapping
} from "@/schemas/mappings/profileSchemaMappings"
import { getAge } from "@/lib/utils"
import { MetricsProfileModel, NutritionResultModel } from "@/generated/prisma/models";
import { MacroSplit } from "@/generated/prisma/enums";


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
export type CalculateWaterDemandProps = Pick<Required<MetricsProfileModel>, "weightKg" | "bodyType" | "activityLevel" | "trainingDaysPerWeek">
export function calculateWaterDemand({ weightKg, activityLevel, bodyType, trainingDaysPerWeek }: CalculateWaterDemandProps) {
  // mappings
  const bodyTypeMap = bodyTypeMapping[bodyType]
  const activityWaterMap = activityWaterValueMapping[activityLevel]

  // calculation factors (litres)
  const waterBaseLitres = weightKg * bodyTypeMap
  const trainingWaterAddition = 0.1 * trainingDaysPerWeek // additionally 100 ml per training day

  //* waterDemand target
  const waterDemand = (waterBaseLitres * activityWaterMap) + trainingWaterAddition

  // min/max range
  const minMaxWaterDemand = getMinMaxRange(waterDemand, 0.1)
  return minMaxWaterDemand
  // return +(WaterDemand).toFixed(0)
}


//* recommended proteins
export type CalculateRecommendedProteinsProps = Pick<Required<MetricsProfileModel>, "weightKg" | "fitnessGoal" | "trainingDaysPerWeek">
export function calculateRecommendedProteins({ weightKg, fitnessGoal, trainingDaysPerWeek }: CalculateRecommendedProteinsProps) {
  const { workoutValue, workoutFactor } = getWorkoutValuesAndFactor({ fitnessGoal, trainingDaysPerWeek })

  const proteinGrams = +(weightKg * workoutValue * workoutFactor)
  const { proteinsGramsMin, proteinsGramsMax } = checkProteinRestrictions({ proteinGrams, weightKg })

  //* ensure proteins are in valid range
  const recommendedProteins = Math.max(Math.min(proteinGrams, proteinsGramsMax), proteinsGramsMin)
  return recommendedProteins
  // return +(recommendedProteins).toFixed(0)
}

//* recommended fats
export type CalculateRecommendedFatsProps = Pick<Required<MetricsProfileModel>, "weightKg" | "gender" | "bodyType" | "fitnessGoal">
export function calculateRecommendedFats({ weightKg, gender, bodyType, fitnessGoal }: CalculateRecommendedFatsProps) {
  const bodyFatValue = bodyFatValueMapping[gender][bodyType]

  // const adjustedBodyFatValue = adjustRecommendedMacro({
  //   macroValue: bodyFatValue, macro: "FATS",
  //   bodyType, fitnessGoal, gender
  // })

  // console.log("base:", bodyFatValue)
  // console.log("adjustment:", adjustedBodyFatValue)

  // const fatGrams = +(weightKg * adjustedBodyFatValue)
  const fatGrams = +(weightKg * bodyFatValue)
  const { fatsMinGrams, fatsMaxGrams } = checkFatRestrictions({ fatGrams, weightKg, gender })

  //* ensure fats are in valid range
  const recommendedFats = Math.max(Math.min(fatGrams, fatsMaxGrams), fatsMinGrams)
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
  const { carbGramsMin } = checkCarbRestrictions({ carbGrams, macroSplitPlan: "RECOMMENDED" })

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
  const { proteinsMinGrams, proteinsMaxGrams } = getProteinsRange({ weightKg })

  const proteinRestrictions = {
    proteinsGramsMin: proteinsMinGrams,
    proteinsGramsMax: proteinsMaxGrams,
    valid: proteinGrams >= proteinsMinGrams && proteinGrams <= proteinsMaxGrams
  }
  return proteinRestrictions
}
//* functions returns the min/max amount for proteins
export function getProteinsRange({ weightKg }: Pick<MetricsProfileModel, "weightKg">) {
  // grams per kg
  const minFactor = 1.4
  const maxFactor = 2.6

  return {
    proteinsMinGrams: weightKg * minFactor,
    proteinsMaxGrams: weightKg * maxFactor
  }
}


//* fats restrictions
// a certain minimal amount of fat is essential to the average person
//? returns `true` if fats amount is "valid"
export type CheckFatRestrictionsProps = Pick<Required<MetricsProfileModel>, "weightKg" | "gender"> & {
  fatGrams: number
}
export function checkFatRestrictions({ weightKg, gender, fatGrams }: CheckFatRestrictionsProps) {
  const fatRestrictions = {
    fatsMinGrams: 0,
    fatsMaxGrams: 0,
    valid: false
  }

  const { fatsMinGrams, fatsMaxGrams } = getFatsRange({ weightKg, gender })
  fatRestrictions.fatsMinGrams = fatsMinGrams
  fatRestrictions.fatsMaxGrams = fatsMaxGrams

  //* provide a "valid" prop which indicates if the fat restriction is met
  fatRestrictions.valid = fatGrams >= fatRestrictions.fatsMinGrams && fatGrams <= fatRestrictions.fatsMaxGrams

  return fatRestrictions
}
//* functions returns the min/max amount for fats
export function getFatsRange({ weightKg, gender }: Pick<MetricsProfileModel, "weightKg" | "gender">) {
  // grams per kg
  const maleMinFactor = 0.6
  const femaleMinFactor = 0.7
  const maleMaxFactor = 1.2
  const femaleMaxFactor = 1.3

  //* determine gender differences for fats amount
  switch (gender) {
    case "MALE":
      return {
        fatsMinGrams: weightKg * (maleMinFactor),
        fatsMaxGrams: weightKg * (maleMaxFactor)
      }
    case "FEMALE":
      return {
        fatsMinGrams: weightKg * (femaleMinFactor),
        fatsMaxGrams: weightKg * (femaleMaxFactor)
      }
  }
}


//* carbs restrictions
// carbs are being calculated with the remaining calories after calculating the essential amounts of proteins and fats.
// Depending on the users profile data the recommended carbs could be below a certain threshold. We check if the threshold is met, else we consider that the calorie goal cannot be held healthy enough with the users profile data and prompt the user to change their fitnessGoal to get higher remaining calories (higher carbGrams)
//? returns `true` if carbs amount is "valid"
export type CheckCarbRestrictionsProps = {
  carbGrams: number
  macroSplitPlan: MacroSplit
}
export function checkCarbRestrictions({ carbGrams, macroSplitPlan }: CheckCarbRestrictionsProps) {
  switch (macroSplitPlan) {
    case "RECOMMENDED":
      //* as a general value we use 50 grams as the threshold. Carbs are not allowed to go below this threshold
      const carbsMinRecommended = 50 // grams

      // functions should return the min amount for carbs and if carbs are above threshold
      return {
        carbGramsMin: carbsMinRecommended,
        valid: carbGrams >= carbsMinRecommended
      }
    case "CUSTOM":
      const carbsMinCustom = 0 // grams

      // functions should return the min amount for carbs and if carbs are above threshold
      return {
        carbGramsMin: carbsMinCustom,
        valid: carbGrams > carbsMinCustom
      }
  }
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

// adjust macro values under certain conditions
type AdjustRecommendedMacroProps = {
  macroValue: number
} & (
    AdjustRecommendedFatsProps | AdjustRecommendedCarbsProps | AdjustRecommendedProteinsProps
  )
type AdjustRecommendedFatsProps =
  { macro: "FATS" }
  & Pick<Required<MetricsProfileModel>, "gender" | "bodyType" | "fitnessGoal">
type AdjustRecommendedCarbsProps =
  { macro: "CARBS" }
// & Pick<Required<MetricsProfileModel>, "bodyType" | "fitnessGoal">
type AdjustRecommendedProteinsProps =
  { macro: "PROTEINS" }
// & Pick<Required<MetricsProfileModel>, "gender" | "fitnessGoal">

function adjustRecommendedMacro(props: AdjustRecommendedMacroProps) {
  let adjustedMacroValue = props.macroValue
  // bodyType, fitnessGoal, gender
  switch (props.macro) {
    case "FATS":
      // fats, if:
      //  1. female
      //  2. bodyType = VERY_ATHLETIC | ATHLETIC
      //  3. fitnessGoal = GAIN_WEIGHT | QUICKLY_GAIN_WEIGHT
      // add 0.1 g/kg to bodyFatValue

      if (props.gender === "FEMALE") {
        if (props.bodyType === "ATHLETIC" || props.bodyType === "VERY_ATHLETIC") {
          if (props.fitnessGoal === "GAIN_WEIGHT" || props.fitnessGoal === "QUICKLY_GAIN_WEIGHT") {
            adjustedMacroValue += 0.1
          }
        }
      }
      break
    case "CARBS":
    // carbs ...
    case "PROTEINS":
    // proteins ...
  }


  return parseFloat(adjustedMacroValue.toFixed(1))
}
