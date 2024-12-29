import { FastifyInstance } from "fastify";
import { schemas } from "../inputs/auth.schema";
import { AuthController } from "../controllers/AuthController";
import { validateWithZod } from "../utils/utils";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/me",
    {
      preHandler: [fastify.authenticate],
    },
    async (request) => {
      return { user: request.user };
    }
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

  fastify.delete(
    "/logout",
    {
      preHandler: [fastify.authenticate],
    },
    AuthController.logoutHandler
  );
}
