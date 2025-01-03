import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { authRoutes } from "./auth";
import { eventRoutes } from "./event";
import { ticketRoutes } from "./ticket";
import { notificationRoutes } from "./notification";
import { postRoutes } from "./post";

export async function routes(
  fastify: FastifyInstance,
  options: RouteShorthandOptions
) {
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(eventRoutes, { prefix: "/events" });
  fastify.register(ticketRoutes, { prefix: "/tickets" });
  fastify.register(postRoutes, { prefix: "/posts" });
  fastify.register(notificationRoutes, { prefix: "/notifications" });
}
