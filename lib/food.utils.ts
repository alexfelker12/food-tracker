import { FoodWithPortionsType } from "@/orpc/router/food/list"

import { BASE_PORTION_NAME } from "./constants"


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
