import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";
import { getFoodListing } from "@/server/actions/food";
import z from "zod";

export const listFood = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/food/list",
    summary: "Gets the list of trackable foods",
    tags: ["Food"]
  })
  .input(z.object({
    search: z.string().optional()
  }))
  .output(z.custom<Awaited<ReturnType<typeof getFoodListing>>>())
  .handler(async ({ input: { search } }) => {
    const foodList = await getFoodListing({ search })
    return foodList
  })
