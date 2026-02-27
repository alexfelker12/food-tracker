import { ActivityLevel, BodyType, FitnessGoal, Gender } from "@/generated/prisma/enums";


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
type WorkoutValueType = Record<FitnessGoal, number>
export const workoutFactorMapping: { [t: number]: number } = {
  0: 1,
  1: 1,
  2: 1,
  3: 1,
  4: 1.03,
  5: 1.05,
  6: 1.07,
  7: 1.07
}
export const workoutValueMapping: WorkoutValueType = {
  QUICKLY_LOSE_WEIGHT: 2.3,
  LOSE_WEIGHT: 2.1,
  MAINTAIN: 1.9,
  GAIN_WEIGHT: 1.7,
  QUICKLY_GAIN_WEIGHT: 1.6,
}
export const noWorkoutValueMapping: WorkoutValueType = {
  QUICKLY_LOSE_WEIGHT: 2,
  LOSE_WEIGHT: 1.9,
  MAINTAIN: 1.8,
  GAIN_WEIGHT: 1.6,
  QUICKLY_GAIN_WEIGHT: 1.4,
}

// fat calculation bodyfat factor
export const bodyFatValueMapping: Record<Gender, Record<BodyType, number>> = {
  MALE: {
    VERY_ATHLETIC: 1.1,
    ATHLETIC: 1,
    AVERAGE: 0.9,
    SLIGHTLY_OVERWEIGHT: 0.8,
    MORE_OVERWEIGHT: 0.7,
  },
  FEMALE: {
    VERY_ATHLETIC: 1.2,
    ATHLETIC: 1.1,
    AVERAGE: 1,
    SLIGHTLY_OVERWEIGHT: 0.9,
    MORE_OVERWEIGHT: 0.8,
  }
}

// water demand 
export const bodyTypeValueMapping: Record<BodyType, number> = {
  VERY_ATHLETIC: 0.04,
  ATHLETIC: 0.038,
  AVERAGE: 0.035,
  SLIGHTLY_OVERWEIGHT: 0.033,
  MORE_OVERWEIGHT: 0.03,
}

export const activityWaterValueMapping: Record<ActivityLevel, number> = {
  VERY_LOW: 1,
  LOW: 1.05,
  MEDIUM: 1.10,
  HIGH: 1.15,
  VERY_HIGH: 1.20,
}
