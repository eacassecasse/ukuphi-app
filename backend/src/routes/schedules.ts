import { FastifyInstance } from "fastify";
import { EventController } from "../controllers/EventController";

export async function scheduleRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    EventController.listScheduledHandler
  );
}
