import { BASE_PORTION_GRAMS, BASE_PORTION_NAME } from "@/lib/constants";
import { db } from "@/lib/db";
import { foodWithPortionsSchema } from "@/schemas/food/foodSchema";
import { FoodWithPortionsSchema } from "@/schemas/types";


//* food by id
interface GetCalorieRangeFromCurrentNutritionResultProps {
  userId: string
}
export async function getCalorieRangeFromCurrentNutritionResult({
  userId
}: GetCalorieRangeFromCurrentNutritionResultProps) {
  return await db.nutritionResult.findFirst({
    where: {
      metricsProfile: { userId },
    },
    select: {
      bmr: true,
      calorieGoalTarget: true,
      tdee: true
    },
    orderBy: { date: "desc" },
  })
}
