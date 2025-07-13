import { prisma } from "@/lib/prisma/client";
import { FastifyJWT } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyOwnership(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const user = await prisma.user.findUnique({
    where: {
      id: request.params.id,
    },
  });

  if (!user) {
    return reply.status(404).send({
      message: "Resource not found",
    });
  }

  if (user.id !== request.params.id && request.user.role !== "ADMIN") {
    return reply.status(403).send({
      message: "Access Denied",
    });
  }
}
