import { FastifyInstance } from "fastify";
import { OrganizerController } from "../controllers/OrganizerController";

export async function bookingRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    OrganizerController.listBookingsHandler
  );
}
