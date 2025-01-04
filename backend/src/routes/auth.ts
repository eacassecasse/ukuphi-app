import { FastifyInstance } from "fastify";
import { schemas } from "../inputs/auth.schema";
import { AuthController } from "../controllers/AuthController";
import { validateWithZod } from "../utils/validation.zod";
import { UserController } from "../controllers/UserController";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", UserController.registerHandler);

  fastify.get(
    "/profile",
    {
      preHandler: [fastify.authenticate],
    },
    UserController.getHandler
  );

  fastify.put(
    "/profile",
    {
      preHandler: [fastify.authenticate],
    },
    UserController.updateHandler
  );

  fastify.post(
    "/login",
    {
      schema: {
        body: schemas.jsonLoginSchema,
        response: {
          201: schemas.jsonLoginResponseSchema,
        },
      },
      preHandler: async (req, res) => {
        try {
          req.body = validateWithZod(schemas.loginSchema)(req.body);
        } catch (error: any) {
          res.status(400).send({ error: error.message });
        }
      },
    },
    AuthController.loginHandler
  );

  fastify.get(
    "/refresh",
    {
      preHandler: [fastify.authenticate],
    },
    AuthController.refreshTokenHandler
  );

  fastify.post("/verify-otp", UserController.verifyOTPHandler);

  fastify.delete(
    "/logout",
    {
      preHandler: [fastify.authenticate],
    },
    AuthController.logoutHandler
  );
}
