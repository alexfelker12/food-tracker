import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";
import { getFoodById } from "@/server/actions/food";
import z from "zod";

export const foodById = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/food/get",
    summary: "Gets a single trackable food",
    tags: ["Food"]
  })
  .input(z.object({
    foodId: z.string()
  }))
  .output(z.custom<Awaited<ReturnType<typeof getFoodById>>>())
  .handler(async ({ input: { foodId } }) => {
    const singleFood = await getFoodById({ foodId })
    return singleFood
  })
