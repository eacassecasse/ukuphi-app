import { FastifyReply, FastifyRequest } from "fastify";
import { EventService } from "../services/EventService";
import {
  CreateEventInput,
  CreateEventResponse,
  schemas,
  UpdateEventInput,
} from "../inputs/event.schema";
import { validateWithZod } from "../utils/validation.zod";
import { schemas as commentSchema, CreateCommentInput } from "../inputs/comment.schema";
import { PostService } from "../services/PostService";

export class PostController {
  static async createHandler(
    request: FastifyRequest<{ Body: CreateEventInput }>,
    reply: FastifyReply
  ) {
    if (request.user.role !== "ORGANIZER") {
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
      }


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
    const user = request.user

    try {
      let events;

      if (user && user.role === "ORGANIZER") {
        events = await EventService.findEventsByOrganizer(user.id);
      } else {
        events = await EventService.find();
      }

      if (!events || events.length === 0) {
        return reply.status(404).send({
          message: "No events found",
        });
      }

      return reply.status(200).send(events);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error.message || error,
      });
    }
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

    try {
      const event = await EventService.findOne(id);

      const response: CreateEventResponse = {
        ...event,
        date: event.date.toISOString().replace("T", " ").split(".")[0],
      }

      return reply.status(200).send(response);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async updateHandler(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateEventInput }>,
    reply: FastifyReply
  ) {
    if (request.user.role !== "ORGANIZER") {
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

    try {
      const input = {
        id,
        ...body,
      };
      const event = await EventService.updateEvent(request.user.id, body);

      const response: CreateEventResponse = {
        ...event,
        date: event.date.toISOString().replace("T", " ").split(".")[0],
      }

      return reply.status(200).send(response);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async deleteHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    if (request.user.role !== "ORGANIZER") {
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

    try {
      await EventService.deleteEvent(request.user.id, id);

      return reply.status(204).send();
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async commentHandler(
        request: FastifyRequest<{ Params: {id: string}; Body: CreateCommentInput }>,
        reply: FastifyReply
      ) {
    
        const body = validateWithZod(commentSchema.createCommentSchema)(request.body);
    
        try {
          const { id } = request.params
          if (!id) {
            return reply.status(400).send({
              message: "Missing ID param"
            })
          }
  
          const input = {
            post_id: id,
            ...body
          }
    
          const comment = await PostService.comment(request.user.id, input);
    
          await validateWithZod(commentSchema.createPostCommentResponseSchema)(comment);
    
    
          return reply.status(201).send(comment);
        } catch (error: any) {
          console.error(error);
          reply.status(500).send({
            message: "Internal Server Error",
            error: error,
          });
        }
      }
    
      static async listCommentsHandler(
        request: FastifyRequest<{ Params: { id: string }}>,
        reply: FastifyReply) {
    
        try {
          const { id } = request.params
    
          if (!id) {
            return reply.status(400).send({
              message: "Missing ID param"
            })
          }
          const comments = await PostService.listComments(id);
    
          if (!comments || comments.length === 0) {
            return reply.status(404).send({
              message: "No comment found for this post",
            });
          }
    
          return reply.status(200).send(comments);
        } catch (error: any) {
          console.error(error);
          reply.status(500).send({
            message: "Internal Server Error",
            error: error.message || error,
          });
        }
      }
}
