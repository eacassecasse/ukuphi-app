import { FastifyInstance } from "fastify";
import { EventController } from "../controllers/EventController";
import { FastifyJWT } from "@fastify/jwt";
import { generateRefreshToken } from "../plugins/authenticate";
import { TicketController } from "../controllers/TicketController";

export async function ticketRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/:id/payments",
    {
      preHandler: [fastify.authenticate],
    },
    TicketController.purchaseHandler
  );

  fastify.get(
    "/:id/payments",
    {
      preHandler: [fastify.authenticate],
    },
    TicketController.viewPaymentHandler
  );
}
