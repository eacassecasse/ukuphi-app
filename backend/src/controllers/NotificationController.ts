import { FastifyReply, FastifyRequest } from "fastify";
import { validateWithZod } from "../utils/validation.zod";
import { NotificationService } from "../services/NotificationService";
import { schemas } from "../inputs/notification.schema";
import { redis } from "../lib/redis";

export class NotificationController {
  static async listHandler(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user;

    try {
      await redis.connect();

      const cacheKey = `user-${request.user.id}-notifications`;
      const cached = await redis.get(cacheKey);

      if (cached) {
        return reply.status(200).send(JSON.parse(cached));
      }

      const notifications = await NotificationService.find(request.user.id);

      if (!notifications || notifications.length === 0) {
        return reply.status(404).send({
          message: "No notifications found",
        });
      }

      await redis.set(cacheKey, JSON.stringify(notifications), 3600);

      return reply.status(200).send(notifications);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error.message || error,
      });
    }
  }

  static async updateHandler(
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
      const notification = await NotificationService.update(request.user.id, {
        id,
      });

      await validateWithZod(schemas.createNotificationResponseSchema)(
        notification
      );

      return reply.status(200).send(notification);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
        error: error,
      });
    }
  }
}
