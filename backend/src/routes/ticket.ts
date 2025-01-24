import { FastifyInstance } from "fastify";
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
