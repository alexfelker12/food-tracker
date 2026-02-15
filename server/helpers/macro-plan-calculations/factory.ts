import { MacroSplit } from "@/generated/prisma/enums"

import type { MacroCalculationStrategy } from "./context"
import { CustomMacroStrategy } from "./strategy-custom"
import { RecommendedMacroStrategy } from "./strategy-recommended"

//* factory function to create the corresponding strategy calculation instance
export function createMacroStrategy(plan: MacroSplit): MacroCalculationStrategy {
  switch (plan) {
    case "RECOMMENDED":
      return new RecommendedMacroStrategy()
    case "CUSTOM":
      return new CustomMacroStrategy()
    default:
      throw new Error(`Unsupported macro plan: ${plan}`)
  }
}
