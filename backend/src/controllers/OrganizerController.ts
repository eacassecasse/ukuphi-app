import { FastifyReply, FastifyRequest } from "fastify";
import { redis } from "../lib/redis";
import { OrganizerService } from "../services/OrganizerService";
import { TicketService } from "../services/TicketService";

export class OrganizerController {
  static async listCustomerHandler(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    if (request.user.role !== "ORGANIZER") {
      return reply.status(403).send({
        message: "Not authorized",
      });
    }

    await redis.connect();

    const cacheKey = `organizer-${request.user.id}-customers`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return reply.status(200).send(JSON.parse(cached));
    }

    const customers = await OrganizerService.findCustomers(request.user.id);

    if (!customers || customers.length === 0) {
      return reply.status(200).send([]);
    }

    await redis.set(cacheKey, JSON.stringify(customers), 3600);

    return reply.status(200).send(customers);
  }

  static async listBookingsHandler(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    if (request.user.role !== "ORGANIZER") {
      return reply.status(403).send({
        message: "Not authorized",
      });
    }

    await redis.connect();

    const cacheKey = `organizer-${request.user.id}-bookings`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return reply.status(200).send(JSON.parse(cached));
    }

    const bookings = await TicketService.listBookings(request.user.id);

    if (!bookings || bookings.length === 0) {
      return reply.status(200).send([]);
    }

    await redis.set(cacheKey, JSON.stringify(bookings), 3600);

    return reply.status(200).send(bookings);
  }
}
