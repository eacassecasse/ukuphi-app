import { fastify, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fjwt from "@fastify/jwt";
import fastifyCookie from "fastify-cookie";
import rateLimit from "fastify-rate-limiter";
import dotenv from "dotenv";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { authenticate } from "./plugins/authenticate";
import { registerErrorHandler } from "./plugins/errorHandler";
import { verifyOwnership } from "./plugins/verifyOwnership";
import { verifyRole } from "./plugins/verifyRole";
import { eventRoutes } from "@modules/events/events.routes";

dotenv.config();

export const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

registerErrorHandler(app);


app.register(import("@fastify/compress"));
app.register(cors, { origin: true });
app.register(helmet, { contentSecurityPolicy: false });
app.register(fjwt, {
  secret: process.env.JWT_ACCESS_TOKEN_SECRET || "ukuphi-app-jwt",
  sign: {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
  },
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.decorate("authenticate", authenticate);
app.decorate("verifyOwnership", verifyOwnership);
app.decorate("verifyRole", verifyRole);
app.addHook("preHandler", (req, res, next) => {
  req.jwt = app.jwt;
  return next();
});

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || "ukuphi-app-cookie",
});

app.register(rateLimit, {
  max: 100,
  timeWindow: 60,
  keyGenerator: (req: FastifyRequest) => req.ip,
});

//Routes
app.get("/api/v1/health", async (req, res) => {
  return { status: "OK" };
});

app.register(eventRoutes, { prefix: "/api/v1" });

async function bootstrap() {
  try {
    await app.listen({
      port: parseInt(process.env.PORT || "5000"),
      host: "0.0.0.0",
    });

    console.log("Server running on port 5000");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

bootstrap();
