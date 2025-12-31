import { BASE_PORTION_GRAMS, BASE_PORTION_NAME } from "@/lib/constants";
import { db } from "@/lib/db";

import { foodWithPortionsSchema } from "@/schemas/food/foodSchema";
import { FoodWithPortionsSchema } from "@/schemas/types";


//* food with portions
interface InsertFoodPropsWithPortions extends FoodWithPortionsSchema {
  userId: string
}
export async function insertFoodWithPortions({ food, portions, barcodes, userId }: InsertFoodPropsWithPortions) {
  const { success, data } = await foodWithPortionsSchema.safeParseAsync({ food, portions, barcodes })
  if (!success) return null; // parse failed -> bad request

  const dbBarcodes = data.barcodes.map(({ barcode }) => barcode)
  const is100gDefault = data.portions.every((portion) => !portion.isDefault)

  return await db.food.create({
    data: {
      ...data.food,
      barcodes: dbBarcodes,
      user: {
        connect: {
          id: userId
        }
      },
      portions: {
        createMany: {
          data: [
            {
              name: BASE_PORTION_NAME,
              grams: BASE_PORTION_GRAMS,
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


//* food by id
interface GetFoodByIdProps {
  foodId: string
}
export async function getFoodById({ foodId }: GetFoodByIdProps) {
  return await db.food.findFirst({
    where: {
      id: foodId,
    },
    include: {
      portions: true,
    }
  })
}


//* foods by barcode
interface GetFoodsByBarcodeProps {
  barcode: string
}
export async function getFoodsByBarcode({ barcode }: GetFoodsByBarcodeProps) {
  return await db.food.findMany({
    where: {
      barcodes: {
        has: barcode
      },
    },
    include: {
      portions: true,
    }
  })
}
