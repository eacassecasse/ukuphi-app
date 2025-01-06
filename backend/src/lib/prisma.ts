import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db =
  globalThis.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// Prisma Lifecycle Management
process.on("SIGINT", async () => {
  await db.$disconnect();
  console.log("Disconnected Prisma Client");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await db.$disconnect();
  console.log("Disconnected Prisma Client");
  process.exit(0);
});
