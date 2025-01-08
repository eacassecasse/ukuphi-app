import Fastify, { FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fastifyCookie from "fastify-cookie";
import rateLimit from "fastify-rate-limiter";
import dotenv from "dotenv";
import { authenticate } from "./plugins/authenticate";
import { routes } from "./routes";
import { registerErrorHandler } from "./plugins/errorHandler";

dotenv.config({
  path: "../.env",
});

export const fastify = Fastify({
  logger: true,
});

registerErrorHandler(fastify);

fastify.register(import("@fastify/compress"));
fastify.register(cors, { origin: true });
fastify.register(helmet, { contentSecurityPolicy: false });
fastify.register(fjwt, {
  secret: process.env.JWT_ACCESS_TOKEN_SECRET || "ukuphi-app-jwt",
  sign: {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
  },
});

fastify.decorate("authenticate", authenticate);
fastify.addHook("preHandler", (req, res, next) => {
  req.jwt = fastify.jwt;
  return next();
});

fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || "ukuphi-app-cookie",
});

fastify.register(rateLimit, {
  max: 100,
  timeWindow: 60,
  keyGenerator: (req: FastifyRequest) => req.ip,
});

//Routes
fastify.get("/hello", async (req, res) => {
  return { message: "Hello world!", proc: process.env };
});

fastify.register(routes, { prefix: "/api/v1" });

async function bootstrap() {
  try {
    await fastify.listen({
      port: parseInt(process.env.PORT || "5000"),
      host: "0.0.0.0",
    });

    console.log("Server running on port 5000");
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

bootstrap();
