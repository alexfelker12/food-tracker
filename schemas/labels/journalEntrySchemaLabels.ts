import { IntakeTime } from "@/generated/prisma/enums";

//* -----------------------------
//* LABELS
//* -----------------------------

export const intakeTimeLabels: Record<IntakeTime, string> = {
  BREAKFAST: "Frühstück",
  LUNCH: "Mittagessen",
  DINNER: "Abendessen",
  SNACKS: "Snacks",
}
