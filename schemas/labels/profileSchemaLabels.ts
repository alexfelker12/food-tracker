import { ActivityLevel, BodyType, FitnessGoal, Gender } from "@/generated/prisma/enums";

//* -----------------------------
//* LABELS
//* -----------------------------

export const genderLabels: Record<Gender, string> = {
  MALE: "Männlich",
  FEMALE: "Weiblich",
}

export const bodyTypeLabels: Record<BodyType, string> = {
  VERY_ATHLETIC: "Sehr athletisch",
  ATHLETIC: "Athletisch",
  AVERAGE: "Durchschnittlich",
  SLIGHTLY_OVERWEIGHT: "Etwas übergewichtig",
  MORE_OVERWEIGHT: "Stark übergewichtig",
}

export const fitnessGoalLabels: Record<FitnessGoal, string> = {
  QUICKLY_LOSE_WEIGHT: "Schnell abnehmen",
  LOSE_WEIGHT: "Abnehmen",
  MAINTAIN: "Halten",
  GAIN_WEIGHT: "Zunehmen",
  QUICKLY_GAIN_WEIGHT: "Schnell zunehmen",
}

export const activityLevelLabels: Record<ActivityLevel, string> = {
  VERY_LOW: "Sehr niedrig",
  LOW: "niedrig",
  MEDIUM: "mittel",
  HIGH: "hoch",
  VERY_HIGH: "Sehr hoch",
}
