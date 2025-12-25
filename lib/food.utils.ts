import { FoodWithPortionsType } from "@/orpc/router/food/list"

import { BASE_PORTION_NAME } from "./constants"
import { IntakeTime } from "@/generated/prisma/enums"


export const getDefaultPortionData = (foodWithPortions: FoodWithPortionsType) => {
  const defaultPortionData = {
    kcal: foodWithPortions.kcal,
    name: BASE_PORTION_NAME
  }

  // check if 100 grams is not default portion
  const defaultPortion = foodWithPortions.portions.find((portion) => portion.isDefault && portion.name !== BASE_PORTION_NAME)

  if (defaultPortion) {
    defaultPortionData.kcal = +(foodWithPortions.kcal * (defaultPortion.grams / 100)).toFixed(0)
    defaultPortionData.name = defaultPortion.name
  }

  return defaultPortionData
}

//TODO: decide for use of automatic intake times
export function guessIntakeTimeByHour(date: Date): IntakeTime {
  const hour = date.getHours()

  if (hour < 10) return "BREAKFAST"
  if (hour < 14) return "LUNCH"
  if (hour < 18) return "SNACKS"
  return "DINNER"
}

