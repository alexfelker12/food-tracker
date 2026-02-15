import { ActivityLevel, BodyType, FitnessGoal, Gender, MacroSplit } from "@/generated/prisma/enums";
import {
  SlidersHorizontalIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react";

//* -----------------------------
//* LABELS
//* -----------------------------

type DetailedOption = {
  label: string
  description: string
  icon: LucideIcon
  disabled?: boolean
}

export type DetailedOptionLabel<T extends string> = Record<T, DetailedOption>

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

export const macroSplitLabels: DetailedOptionLabel<MacroSplit> = {
  RECOMMENDED: {
    label: "Empfohlen",
    description: "Nutze eine von uns empfohlene Nährstoffverteilung",
    icon: SparklesIcon
  },
  CUSTOM: {
    label: "Anpassen (bald wieder verfügbar)",
    description: "Passe deine Nährstoffverteilung selbst an",
    icon: SlidersHorizontalIcon,
    disabled: true
  },
}

