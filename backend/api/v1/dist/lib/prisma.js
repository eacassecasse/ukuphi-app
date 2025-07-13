"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
exports.db = globalThis.prisma ||
    new client_1.PrismaClient({
        log: ["error"],
    });
if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = exports.db;
}
// Prisma Lifecycle Management
process.on("SIGINT", async () => {
    await exports.db.$disconnect();
    console.log("Disconnected Prisma Client");
    process.exit(0);
});
process.on("SIGTERM", async () => {
    await exports.db.$disconnect();
    console.log("Disconnected Prisma Client");
    process.exit(0);
});
