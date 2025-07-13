import { FastifyInstance } from "fastify";
import { NotificationController } from "../controllers/NotificationController";

export async function notificationRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    NotificationController.listHandler
  );

  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    NotificationController.updateHandler
  );
}
