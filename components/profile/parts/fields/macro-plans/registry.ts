import { MacroSplit } from "@/generated/prisma/enums";

import { NutritionResultData } from "@/server/helpers/changedProfileCalculation.v2";
import { CheckPlanValidityReturn } from "@/server/helpers/macro-plan-calculations/context";

import { CustomPlan } from "./custom";
import { RecommendedPlan } from "./recommended";

export type SelectedPlanProps = {
  nutritionResult: NutritionResultData
  planValidity: CheckPlanValidityReturn
}
export const macroPlanRegistry: Record<
  MacroSplit,
  React.ComponentType<SelectedPlanProps>
> = {
  RECOMMENDED: RecommendedPlan,
  CUSTOM: CustomPlan,
}
