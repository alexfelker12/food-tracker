import { PrismaClient } from "@/generated/client/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export const caching = {
  cacheStrategy: {
    // ttl: 60, // time-to-live in seconds
    // swr: 60, // stale-while-revalidate duration in seconds
  },
}
