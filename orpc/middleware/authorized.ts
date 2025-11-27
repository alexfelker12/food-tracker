import { auth } from "@/lib/auth";
import { base } from "./base";

export const authMiddleware = base
  .middleware(async ({ context, next, errors }) => {
    const sessionData = await auth.api.getSession({
      headers: context.headers,
    })

    if (!sessionData) throw errors.UNAUTHORIZED()

    // Adds session and user to the context
    return next({
      context: {
        session: {
          session: sessionData.session, // TODO: adjust data that gets passed into context. Should not be too big for performance reasons
          user: sessionData.user
        }
      }
    })
  })
