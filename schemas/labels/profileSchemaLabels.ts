import { ActivityLevelEnumKeys, BodyTypeEnumKeys, FitnessGoalEnumKeys, GenderEnumKeys } from "../types";

//* -----------------------------
//* LABELS
//* -----------------------------

export const genderLabels: Record<GenderEnumKeys, string> = {
  MALE: "Männlich",
  FEMALE: "Weiblich",
}

export const bodyTypeLabels: Record<BodyTypeEnumKeys, string> = {
  VERY_ATHLETIC: "Sehr athletisch",
  ATHLETIC: "Athletisch",
  AVERAGE: "Durchschnittlich",
  SLIGHTLY_OVERWEIGHT: "Etwas übergewichtig",
  MORE_OVERWEIGHT: "Stark übergewichtig",
}

export const fitnessGoalLabels: Record<FitnessGoalEnumKeys, string> = {
  QUICKLY_LOSE_WEIGHT: "Schnell abnehmen",
  LOSE_WEIGHT: "Abnehmen",
  MAINTAIN: "Halten",
  GAIN_WEIGHT: "Zunehmen",
  QUICKLY_GAIN_WEIGHT: "Schnell zunehmen",
}

export const activityLevelLabels: Record<ActivityLevelEnumKeys, string> = {
  VERY_LOW: "Sehr niedrig",
  LOW: "niedrig",
  MEDIUM: "mittel",
  HIGH: "hoch",
  VERY_HIGH: "Sehr hoch",
}
