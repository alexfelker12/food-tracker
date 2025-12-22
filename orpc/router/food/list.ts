import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { getFoodListing } from "@/server/actions/food";

import { db } from "@/lib/db";


type GetFoodListingReturn = Awaited<ReturnType<typeof getFoodListing>>
type ProcedureReturnType = {
  foods: GetFoodListingReturn
  nextCursor?: string
}
export type FoodListingType = NonNullable<GetFoodListingReturn>
export type FoodWithPortionsType = FoodListingType[number]
export const listFood = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/food/list",
    summary: "Gets the list of trackable foods",
    tags: ["Food"]
  })
  .input(z.object({
    search: z.string(),
    limit: z.number().min(1).max(30).optional(),
    cursor: z.string().optional()
  }))
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({
    input: { search, limit = 20, cursor }
  }) => {
    // const foodList = await getFoodListing({ search })

    //? "search" does not do any partial matching, leaving out some very valid search result. Using insensitive contains for now
    // "word1 | word2 | ..." combination of the search string
    // const searchWords = search.trim().split(" ").join(" & ")

    const foods = await db.food.findMany({
      //* searched string
      where: {
        name: {
          // search: searchWords, //? does not do partial matching
          contains: search,
          mode: 'insensitive',
        }
      },

      //* pass cursor params when provided (inifinite load triggered for the first time)
      ...(cursor ? {
        cursor: { id: cursor },
        skip: 1 // cursor will be the id of the last fetched message, skip since its already fetched
      } : {}),

      //* take 'limit' amount of records
      take: limit,
      // orderBy: [{}],

      //* include portions to display default portion
      include: {
        portions: {
          where: {
            isDefault: true
          }
        }
      },
    })

    //* create next cursor
    // provide the id of the last fetched food from this subset or undefined, when end is reached
    const nextCursor = foods.length === limit ? foods[foods.length - 1].id : undefined

    return { foods, nextCursor }
  })
