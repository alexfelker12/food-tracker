import z from "zod"
import { base } from "@/orpc/middleware/base"
import { authMiddleware } from "@/orpc/middleware/authorized"

export const listTests = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/test",
    summary: "testing oRPC for this project",
    tags: ["Test"]
  })
  .input(z.void())
  .output(
    z.object({
      tests: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          testProp: z.number()
        })
      ),
      user: z.object({
        id: z.string(),
        name: z.string()
      })
    })
  )
  .handler(async ({ input }) => {
    console.log(input)

    return {
      tests: [
        {
          id: "test1",
          name: "test1name",
          testProp: 17
        },
        {
          id: "test2",
          name: "test2name",
          testProp: 3
        },
        {
          id: "test3",
          name: "test3name",
          testProp: 66
        },
      ],
      user: {
        id: "user1",
        name: "username"
      }
    }
  })
