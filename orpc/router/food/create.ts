import { FoodModel } from "@/generated/prisma/models";
import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";
import { foodWithPortionsSchema } from "@/schemas/food/foodSchema";
import { insertFoodWithPortions } from "@/server/actions/food";
import z from "zod";

export const createFood = base
  .use(authMiddleware)
  .route({
    method: "POST",
    path: "/food/create",
    summary: "Creates a publically trackable food",
    tags: ["Food"]
  })
  .input(foodWithPortionsSchema)
  .output(z.custom<FoodModel>())
  .handler(async ({
    input: { food, portions, barcodes },
    context: { session },
    errors
  }) => {
    const createdFood = await insertFoodWithPortions({ food, portions, barcodes, userId: session.user.id })

    if (!createdFood) throw errors.BAD_REQUEST() // invalid input

    return createdFood
  })
