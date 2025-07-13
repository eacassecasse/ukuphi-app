import { validateWithZod } from "@/utils/validation.zod";
import { FastifyInstance } from "fastify";
import {
  JSONLoginResponseSchema,
  JSONLoginSchema,
  LoginSchema,
} from "./auth.schema";
import { AuthController } from "./controller";

export async function AuthRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/login",
    {
      schema: {
        body: JSONLoginSchema,
        response: {
          200: JSONLoginResponseSchema,
        },
      },
      preHandler: async (req, res) => {
        try {
          req.body = validateWithZod(LoginSchema)(req.body);
        } catch (error: any) {
          res.status(400).send({ error: error.message });
        }
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
