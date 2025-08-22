import { validateWithZod } from "@/utils/validation.zod";
import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'
import { AuthController } from "@modules/auth/auth.controller";
import { LoginSchema } from "@modules/auth/auth.schema";

export const AuthRoutes: FastifyPluginCallbackTypebox = (fastify) => {
  fastify.post(
    "/login",
    {
      schema: {
        body: LoginSchema,
      },
    },
    AuthController.loginHandler
  );

  fastify.post(
    "/refresh",
    {
      preHandler: [fastify.authenticate],
    },
    AuthController.refreshTokenHandler
  );

  fastify.delete(
    "/logout",
    {
      preHandler: [fastify.authenticate],
    },
    AuthController.logoutHandler
  );
}
