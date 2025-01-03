import { FastifyReply, FastifyRequest } from "fastify";
import { EventService } from "../services/EventService";
import { validateWithZod } from "../utils/validation.zod";
import { CreateTicketInput, schemas } from "../inputs/ticket.schema";
import { TicketService } from "../services/TicketService";
import { CreatePaymentInput, schemas as paymentSchema } from "../inputs/payment.schema";
import { redis } from "../lib/redis";

export class TicketController {
  static async registerHandler(
    request: FastifyRequest<{ Params: {id: string}; Body: CreateTicketInput }>,
    reply: FastifyReply
  ) {
    if (request.user.role === "ATTENDEE") {
      return reply.status(403).send({
        message: "Not authorized",
      });
    }

    const body = validateWithZod(schemas.ticketCore)(request.body);

    try {
      const { id } = request.params
      if (!id) {
        return reply.status(400).send({
          message: "Missing ID param"
        })
      }

      const ticket = await TicketService.addTicket(request.user.id, {
        event_id: id,
        ...body
      })

      await validateWithZod(schemas.createTicketResponseSchema)(ticket);


      return reply.status(201).send(ticket);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async listHandler(
    request: FastifyRequest<{ Params: { id: string }}>,
    reply: FastifyReply) {

    try {
      const { id } = request.params

      if (!id) {
        return reply.status(400).send({
          message: "Missing ID param"
        })
      }

      await redis.connect();

      const cacheKey = `events-${id}-tickets`;
      const cached = await redis.get(cacheKey);

      if (cached) {
        return reply.status(200).send(JSON.parse(cached));
      }

      const tickets = await TicketService.find(id);

      if (!tickets || tickets.length === 0) {
        return reply.status(404).send({
          message: "No ticket found for this event",
        });
      }

      await redis.set(cacheKey, JSON.stringify(tickets), 3600);

      return reply.status(200).send(tickets);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error.message || error,
      });
    }
  }

  static async getHandler(
    request: FastifyRequest<{ Params: { id: string, ticketId: string } }>,
    reply: FastifyReply
  ) {

    const { id, ticketId } = request.params;

    if (!id) {
      return reply.status(400).send({
        message: "Missing ID param",
      });
    }

    if (!ticketId) {
      return reply.status(400).send({
        message: "Missing Ticket ID param",
      });
    }

    try {
      await redis.connect();

      const cacheKey = `events-${id}-tickets:${ticketId}`;
      const cached = await redis.get(cacheKey);

      if (cached) {
        return reply.status(200).send(JSON.parse(cached));
      }

      const ticket = await TicketService.findOne(id, ticketId);

      await validateWithZod(schemas.createTicketResponseSchema)(ticket)

      await redis.set(cacheKey, JSON.stringify(ticket), 3600);
      
      return reply.status(200).send(ticket);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async updateHandler(
    request: FastifyRequest<
    {Params: { id: string, ticketId: string }; Body: CreateTicketInput }>,
    reply: FastifyReply
  ) {
    if (request.user.role === "ATTENDEE") {
      return reply.status(403).send({
        message: "Not authorized",
      });
    }

    const body = validateWithZod(schemas.ticketCore)(request.body);

    try {
      const { id, ticketId } = request.params
      if (!id) {
        return reply.status(400).send({
          message: "Missing ID param"
        })
      }

      if (!ticketId) {
        return reply.status(400).send({
          message: "Missing Ticket ID param"
        })
      }

      const ticket = await TicketService.updateTicket(request.user.id, {
        id: ticketId,
        event_id: id,
        ...body
      })

      await validateWithZod(schemas.createTicketResponseSchema)(ticket);


      return reply.status(200).send(ticket);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async deleteHandler(
    request: FastifyRequest<{ Params: { id: string, ticketId: string } }>,
    reply: FastifyReply
  ) {
    if (request.user.role === "ATTENDEE") {
      return reply.status(403).send({
        message: "Not authorized",
      });
    }

    const { id, ticketId } = request.params;

    if (!id) {
      return reply.status(400).send({
        message: "Missing ID param",
      });
    }

    if (!ticketId) {
      return reply.status(400).send({
        message: "Missing Ticket ID param",
      });
    }

    try {
      await TicketService.removeEvent(request.user.id,
        { event_id: id, ticket_id: ticketId }
      );

      return reply.status(204).send();
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async purchaseHandler(
    request: FastifyRequest<{ Params: {id: string}; Body: CreatePaymentInput }>,
    reply: FastifyReply
  ) {
    const body = validateWithZod(paymentSchema.paymentCore)(request.body);

    try {
      const { id } = request.params

      if (!id) {
        return reply.status(400).send({
          message: "Missing ID param"
        })
      }

      const payment = await TicketService.purchase(request.user.id, {
        ticket_id: id,
        ...body
      })

      await validateWithZod(paymentSchema.createPaymentResponseSchema)(payment);


      return reply.status(201).send(payment);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async viewPaymentHandler(
    request: FastifyRequest<{ Params: { id: string }}>,
    reply: FastifyReply) {

    try {
      const { id } = request.params

      if (!id) {
        return reply.status(400).send({
          message: "Missing ID param"
        })
      }
      const payment = await TicketService.viewPayment(request.user.id, id);

      return reply.status(200).send(payment);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error.message || error,
      });
    }
  }
}
