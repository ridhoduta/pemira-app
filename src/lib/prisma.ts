import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";



const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString && process.env.NODE_ENV === "production" && typeof window === "undefined") {
      // During build time or production, if we don't have a connection string, 
      // we return a proxy that throws only when called. 
      // This prevents top-level module load errors.
      console.warn("DATABASE_URL is not defined. Prisma calls will fail.");
    }
    
    return new PrismaClient({
      adapter: new PrismaPg({ connectionString: connectionString || "" }),
      log: process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    });
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
