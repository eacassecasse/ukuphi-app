import { FastifyInstance } from "fastify";
import { OrganizerController } from "../controllers/OrganizerController";

export async function customerRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    OrganizerController.listCustomerHandler
  );
}
