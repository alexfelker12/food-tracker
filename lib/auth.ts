// core
import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// plugins
import { admin, username } from "better-auth/plugins";

// local
import { db } from "./db";
import { validateUsername } from "./utils";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql"
  }),
  trustedOrigins: [
    "http://192.168.178.71:3000",
    "https://food-tracker-orpin.vercel.app"
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }
  },
  plugins: [
    username({
      minUsernameLength: 1,
      usernameValidator: (username) => {
        if (username === "admin") {
          return false
        }
        const { valid } = validateUsername(username)
        return valid
      }
    }),
    admin()
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 3 // duration in seconds
    }
  }
})
