import { ActivityLevelEnum, BodyTypeEnum, FitnessGoalEnum, GenderEnum } from "../profileSchema";

//* -----------------------------
//* LABELS
//* -----------------------------

export const genderLabels: Record<typeof GenderEnum.enum[keyof typeof GenderEnum.enum], string> = {
  MALE: "Männlich",
  FEMALE: "Weiblich",
}

export const fitnessGoalLabels: Record<typeof FitnessGoalEnum.enum[keyof typeof FitnessGoalEnum.enum], string> = {
  QUICKLY_LOSE_WEIGHT: "Schnell abnehmen",
  LOSE_WEIGHT: "Abnehmen",
  MAINTAIN: "Halten",
  GAIN_WEIGHT: "Zunehmen",
  QUICKLY_GAIN_WEIGHT: "Schnell zunehmen",
}
export const activityLevelLabels: Record<typeof ActivityLevelEnum.enum[keyof typeof ActivityLevelEnum.enum], string> = {
  VERY_LOW: "Sehr niedrig",
  LOW: "niedrig",
  MEDIUM: "mittel",
  HIGH: "hoch",
  VERY_HIGH: "Sehr hoch",
}
export const bodyTypeLabels: Record<typeof BodyTypeEnum.enum[keyof typeof BodyTypeEnum.enum], string> = {
  VERY_ATHELTIC: "Sehr athletisch",
  ATHELTIC: "Athletisch",
  AVERAGE: "Durchschnittlich",
  SLIGHTLY_OVERWEIGHT: "Etwas übergewichtig",
  MORE_OVERWEIGHT: "Stark übergewichtig",
}
