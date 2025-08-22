import {
  AuthError,
  ForbiddenError,
  NotFoundError,
} from "@/lib/errors/http/errors";
import { prismaClient } from "@/lib/prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

type UserRole = "ATTENDEE" | "ORGANIZER" | "ADMIN";

export function verifyRole(allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user.id) {
      throw new AuthError();
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: request.user.id,
      },
      select: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    if (!allowedRoles.includes(user.role as UserRole)) {
      throw new ForbiddenError();
    }
  };
}
