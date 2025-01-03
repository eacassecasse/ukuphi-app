import { FastifyReply, FastifyRequest } from "fastify";
import { EventService } from "../services/EventService";
import {
  CreateEventInput,
  CreateEventResponse,
  schemas,
  UpdateEventInput,
} from "../inputs/event.schema";
import { validateWithZod } from "../utils/validation.zod";
import {
  schemas as commentSchema,
  CreateCommentInput,
} from "../inputs/comment.schema";
import { redis } from "../lib/redis";

export class EventController {
  static async registerHandler(
    request: FastifyRequest<{ Body: CreateEventInput }>,
    reply: FastifyReply
  ) {
    if (request.user.role === "ATTENDEE") {
      return reply.status(403).send({
        message: "Not authorized",
      });
    }

    const body = validateWithZod(schemas.createEventSchema)(request.body);

    try {
      const event = await EventService.createEvent(request.user.id, body);

      const response: CreateEventResponse = {
        ...event,
        date: event.date.toISOString().replace("T", " ").split(".")[0],
      };

      return reply.status(201).send(response);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async listHandler(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user;

    await redis.connect();

    const cacheKey = "events-cached";
    const cached = await redis.get(cacheKey);

    if (cached) {
      return reply.status(200).send(JSON.parse(cached));
    }

    const events = await EventService.find();

    if (!events || events.length === 0) {
      return reply.status(404).send({
        message: "No events found",
      });
    }

    await redis.set(cacheKey, JSON.stringify(events), 3600);

    return reply.status(200).send(events);
  }

  static async getHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({
        message: "Missing ID param",
      });
    }

    await redis.connect();

    const cacheKey = `events:${id}`;

    const cached = await redis.get(cacheKey);

    if (cached) {
      return reply.status(200).send(JSON.parse(cached));
    }
    const event = await EventService.findOne(id);

    const response: CreateEventResponse = {
      ...event,
      date: event.date.toISOString().replace("T", " ").split(".")[0],
    };

    await redis.set(cacheKey, JSON.stringify(response), 3600);

    return reply.status(200).send(response);
  }

  static async updateHandler(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateEventInput }>,
    reply: FastifyReply
  ) {
    if (request.user.role === "ATTENDEE") {
      return reply.status(403).send({
        message: "Not authorized",
      });
    }

    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({
        message: "Missing ID param",
      });
    }

    const body = validateWithZod(schemas.createEventSchema)(request.body);

    const input = {
      id,
      ...body,
    };

    const event = await EventService.updateEvent(request.user.id, input);

    const response: CreateEventResponse = {
      ...event,
      date: event.date.toISOString().replace("T", " ").split(".")[0],
    };

    return reply.status(200).send(response);
  }

  static async deleteHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    if (request.user.role === "ATTENDEE") {
      return reply.status(403).send({
        message: "Not authorized",
      });
    }

    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({
        message: "Missing ID param",
      });
    }

    await EventService.deleteEvent(request.user.id, id);

    return reply.status(204).send();
  }

  static async commentHandler(
    request: FastifyRequest<{
      Params: { id: string };
      Body: CreateCommentInput;
    }>,
    reply: FastifyReply
  ) {
    const body = validateWithZod(commentSchema.createCommentSchema)(
      request.body
    );

    const { id } = request.params;
    if (!id) {
      return reply.status(400).send({
        message: "Missing ID param",
      });
    }

    const input = {
      event_id: id,
      ...body,
    };

    const comment = await EventService.comment(request.user.id, input);

    await validateWithZod(commentSchema.createEventCommentResponseSchema)(
      comment
    );

    return reply.status(201).send(comment);
  }

  static async listCommentsHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;

    if (!id) {
      return reply.status(400).send({
        message: "Missing ID param",
      });
    }
    const comments = await EventService.listComments(id);

    if (!comments || comments.length === 0) {
      return reply.status(404).send({
        message: "No comment found for this event",
      });
    }

    return reply.status(200).send(comments);
  }
}
