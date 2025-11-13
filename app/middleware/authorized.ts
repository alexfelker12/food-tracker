import { auth } from "@/lib/auth";
import { base } from "./base";

export const authMiddleware = base.middleware(async ({ context, next, errors }) => {
  const sessionData = context.session ?? await auth.api.getSession({
    headers: context.headers, // or reqHeaders if you're using the plugin
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

export const authorized = base.use(authMiddleware);
