import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

export const betterAuthConfig: BetterAuthOptions = {
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  trustedOrigins: [
    "http://192.168.178.71:3000",
    "https://food-tracker-orpin.vercel.app",
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 24 * 60 * 60 // 1 day
    }
  },
}

export const auth = betterAuth(betterAuthConfig);
