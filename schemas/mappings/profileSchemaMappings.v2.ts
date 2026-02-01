import { ActivityLevel, BodyType, FitnessGoal, Gender } from "@/generated/prisma/enums";


type MinMaxRecord = { min: number, max: number }

//* -----------------------------
//* VALUE MAPPINGS
//* -----------------------------

// activity level
export const activityLevelValueMapping: Record<ActivityLevel, number> = {
  VERY_LOW: 1.2,
  LOW: 1.3,
  MEDIUM: 1.45,
  HIGH: 1.6,
  VERY_HIGH: 1.75,
}

// fitness goal
export const fitnessGoalValueMapping: Record<FitnessGoal, number> = {
  QUICKLY_LOSE_WEIGHT: 0.78,
  LOSE_WEIGHT: 0.85,
  MAINTAIN: 1,
  GAIN_WEIGHT: 1.1,
  QUICKLY_GAIN_WEIGHT: 1.2,
}

// workout factors
type WorkoutValueType = Record<FitnessGoal, MinMaxRecord>
export const workoutFactorMapping: { [t: number]: number } = {
  1: 0.9,
  2: 0.98,
  3: 1,
  4: 1.03,
  5: 1.05,
  6: 1.07,
  7: 1.07
}
export const workoutValueMapping: WorkoutValueType = {
  QUICKLY_LOSE_WEIGHT: { min: 2.3, max: 2.6 },
  LOSE_WEIGHT: { min: 2, max: 2.3 },
  MAINTAIN: { min: 1.8, max: 2 },
  GAIN_WEIGHT: { min: 1.6, max: 1.8 },
  QUICKLY_GAIN_WEIGHT: { min: 1.5, max: 1.7 },
}
export const noWorkoutValueMapping: WorkoutValueType = {
  QUICKLY_LOSE_WEIGHT: { min: 2, max: 2.1 },
  LOSE_WEIGHT: { min: 1.9, max: 2 },
  MAINTAIN: { min: 1.7, max: 1.9 },
  GAIN_WEIGHT: { min: 1.5, max: 1.7 },
  QUICKLY_GAIN_WEIGHT: { min: 1.4, max: 1.5 },
}

// fat calculation bodyfat factor
export const bodyFatValueMapping: Record<Gender, Record<BodyType, MinMaxRecord>> = {
  MALE: {
    VERY_ATHLETIC: { min: 0.7, max: 0.9 },
    ATHLETIC: { min: 0.8, max: 1 },
    AVERAGE: { min: 0.9, max: 1.1 },
    SLIGHTLY_OVERWEIGHT: { min: 1, max: 1.2 },
    MORE_OVERWEIGHT: { min: 1.1, max: 1.3 },
  },
  FEMALE: {
    VERY_ATHLETIC: { min: 0.8, max: 1 },
    ATHLETIC: { min: 0.9, max: 1.1 },
    AVERAGE: { min: 1, max: 1.2 },
    SLIGHTLY_OVERWEIGHT: { min: 1.1, max: 1.3 },
    MORE_OVERWEIGHT: { min: 1.2, max: 1.4 },
  }
}
