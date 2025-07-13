import { FastifyInstance } from "fastify";
import { UserController } from "./controller";
import { UserCreateSchema, UserResponseSchema } from "./users.schema";
import { string } from "zod";
import { validateWithZod } from "@/utils/validation.zod";

export async function UserRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    UserController.createHandler
  );

  fastify.get(
    "/me",
    {
      preHandler: fastify.authenticate,
    },
    UserController.getHandler
  );

  fastify.patch(
    "/:id",
    {
      preHandler: [fastify.authenticate, fastify.verifyOwnership],
    },
    UserController.updateHandler
  );

  fastify.patch(
    "/:id/verify",
    {
      preHandler: [fastify.authenticate, fastify.verifyRole(["ADMIN"])],
    },
    UserController.verifyHandler
  );

  // fastify.post("/verify-otp", UserController.verifyOTPHandler);
}
