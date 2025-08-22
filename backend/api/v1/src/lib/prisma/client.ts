import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prismaClient =
  globalThis.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismaClient;
}

// Handle graceful shutdown
const shutdown = async (signal: NodeJS.Signals) => {
  console.log(`Received ${signal}. Disconnecting Prisma Client...`);
  await prismaClient.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
