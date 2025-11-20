import { auth } from "@/lib/auth";
import { os } from "@orpc/server";

export const base = os
  .$context<{
    headers: Headers,
    session?: typeof auth.$Infer.Session // should be using AuthSession
    // nutritionResult?: NutritionResultModel // 
  }>()
  .errors({
    RATE_LIMITED: {
      message: "You are being rate limited"
    },
    BAD_REQUEST: {
      message: "Bad request..."
    },
    NOT_FOUND: {
      message: "Not found"
    },
    FORBIDDEN: {
      message: "This is forbidden"
    },
    UNAUTHORIZED: {
      message: "You are not authorized"
    },
    INTERNAL_SERVER_ERROR: {
      message: "There was an error on the server"
    }
  })
