import { db } from "@/lib/db";
import { foodWithPortionsSchema } from "@/schemas/food/foodSchema";
import { FoodWithPortionsSchema } from "@/schemas/types";


//* food with portions
interface InsertFoodPropsWithPortions extends FoodWithPortionsSchema {
  userId: string
}
export async function insertFoodWithPortions({ food, portions, userId }: InsertFoodPropsWithPortions) {
  const { success, data } = await foodWithPortionsSchema.safeParseAsync({ food, portions })

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

//* food listing (for now all foods - will be optimized)
interface GetFoodListingProps {
  search?: string
}
export async function getFoodListing({ search }: GetFoodListingProps) {
  return await db.food.findMany({
    // where: {},
    include: {
      portions: {
        where: {
          isDefault: true
        }
      }
    }
  })
}

