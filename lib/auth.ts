import { betterAuth, BetterAuthOptions } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { username } from "better-auth/plugins"

import { db } from "./db"
import { validateUsername } from "./utils"

export const betterAuthConfig: BetterAuthOptions = {
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
    })
  ]
}

export const auth = betterAuth(betterAuthConfig)
