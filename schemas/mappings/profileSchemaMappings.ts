import { ActivityLevel, BodyType, FitnessGoal, Gender } from "@/generated/prisma/enums";
import type {
  FlatProfileSchema,
  MacroSplits,
  MappedFlatProfileSchema
} from "../types";

//* -----------------------------
//* VALUE MAPPINGS
//* -----------------------------

export const activityLevelValueMapping: Record<ActivityLevel, number> = {
  VERY_LOW: 1.2,
  LOW: 1.35,
  MEDIUM: 1.55,
  HIGH: 1.75,
  VERY_HIGH: 1.9,
}

export const fitnessGoalValueMapping: Record<FitnessGoal, number> = {
  QUICKLY_LOSE_WEIGHT: 0.75,
  LOSE_WEIGHT: 0.87,
  MAINTAIN: 1,
  GAIN_WEIGHT: 1.1,
  QUICKLY_GAIN_WEIGHT: 1.2,
}

export const bodyFatPercentageValueMapping: Record<Gender, Record<BodyType, number>> = {
  MALE: {
    VERY_ATHLETIC: 8,
    ATHLETIC: 13,
    AVERAGE: 18,
    SLIGHTLY_OVERWEIGHT: 24,
    MORE_OVERWEIGHT: 31,
  },
  FEMALE: {
    VERY_ATHLETIC: 16,
    ATHLETIC: 21,
    AVERAGE: 26,
    SLIGHTLY_OVERWEIGHT: 32,
    MORE_OVERWEIGHT: 40,
  }
}

export const recommendedBaseSplitsMapping: Record<FitnessGoal, MacroSplits> = {
  QUICKLY_LOSE_WEIGHT: {
    fatSplit: 25,
    carbSplit: 40,
    proteinSplit: 35
  },
  LOSE_WEIGHT: {
    fatSplit: 25,
    carbSplit: 45,
    proteinSplit: 30
  },
  MAINTAIN: {
    fatSplit: 25,
    carbSplit: 50,
    proteinSplit: 25
  },
  GAIN_WEIGHT: {
    fatSplit: 28,
    carbSplit: 50,
    proteinSplit: 22
  },
  QUICKLY_GAIN_WEIGHT: {
    fatSplit: 30,
    carbSplit: 50,
    proteinSplit: 20
  },
}

export const flatProfileSchemaMapping = ({
  gender, birthDate, heightCm, weightKg, bodyType, fitnessGoal, activityLevel, trainingDaysPerWeek, proteinSplit, fatSplit, carbSplit, useRecommended
}: Required<FlatProfileSchema>): MappedFlatProfileSchema => {
  return {
    gender,
    birthDate,
    heightCm,
    weightKg,
    kfaMap: bodyFatPercentageValueMapping[gender][bodyType],
    fitnGoalMap: fitnessGoalValueMapping[fitnessGoal],
    activityMap: activityLevelValueMapping[activityLevel],
    trainingDaysPerWeek,
    proteinSplit,
    fatSplit,
    carbSplit,
    useRecommended
  }
}
