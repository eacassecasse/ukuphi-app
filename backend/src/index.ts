import Fastify, { FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fastifyCookie from "fastify-cookie";
import rateLimit from "fastify-rate-limiter";
import { authenticate } from "./plugins/authenticate";
import { routes } from "./routes";


const fastify = Fastify({
  logger: true,
});

fastify.get("/hello", async (req, res) => {
  return { message: "Hello world!" };
});

async function bootstrap() {
  try {
    fastify.register(cors, { origin: true });
    fastify.register(fjwt, {
      secret: process.env.JWT_SECRET || "ukuphi-app-jwt",
      sign: {
        expiresIn: "15m",
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
    fastify.register(routes, { prefix: "/api/v1"})  

    await fastify.listen({
      port: 5000,
      host: "0.0.0.0",
    });

    console.log("Server running on port 5000");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

bootstrap();
