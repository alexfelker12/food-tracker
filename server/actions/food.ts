import { db } from "@/lib/db";
import { FoodWithPortionsSchema } from "@/schemas/food/foodSchema";
import { z } from "zod";


//* food with portions
interface InsertFoodPropsWithPortions extends z.infer<typeof FoodWithPortionsSchema> {
  userId: string
}
export async function insertFoodWithPortions({ food, portions, userId }: InsertFoodPropsWithPortions) {
  const { success, data } = await FoodWithPortionsSchema.safeParseAsync({ food, portions })

  if (!success) return null; // parse failed -> bad request

  const is100gDefault = data.portions.every((portion) => !portion.isDefault)

  return await db.food.create({
    data: {
      ...data.food,
      user: {
        connect: {
          id: userId
        }
      },
      portions: {
        createMany: {
          data: [
            {
              name: "100g",
              grams: 100,
              isDefault: is100gDefault
            },
            ...data.portions // additional portions
          ],
          skipDuplicates: true
        }
      }
    }
  })
}
