import fp from "fastify-plugin";
import { PrismaService } from "@/modules/prisma/prisma.service";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaService;
  }
}

export default fp(
  async (fastify) => {
    const prisma = PrismaService.getInstance(fastify.log);

    await prisma.connect();

    fastify.decorate("prisma", prisma);

    fastify.addHook("onClose", async (instance) => {
      await instance.prisma.disconnect();
    });
  },
  {
    name: "prisma",
    dependencies: [],
  }
);
