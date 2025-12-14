import { BASE_PORTION_GRAMS, BASE_PORTION_NAME } from "@/lib/constants";
import { db } from "@/lib/db";
import { foodWithPortionsSchema } from "@/schemas/food/foodSchema";
import { FoodWithPortionsSchema } from "@/schemas/types";


//* food by id
interface GetCaloryRangeFromCurrentNutritionResultProps {
  userId: string
}
export async function getCaloryRangeFromCurrentNutritionResult({
  userId
}: GetCaloryRangeFromCurrentNutritionResultProps) {
  return await db.nutritionResult.findFirst({
    where: {
      metricsProfile: { userId },
    },
    select: {
      bmr: true,
      caloryGoal: true,
      tdee: true
    },
    orderBy: { date: "desc" },
  })
}
