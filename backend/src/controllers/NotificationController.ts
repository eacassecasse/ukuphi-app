import { FastifyReply, FastifyRequest } from "fastify";
import { validateWithZod } from "../utils/validation.zod";
import { NotificationService } from "../services/NotificationService";
import { schemas } from "../inputs/notification.schema";

export class NotificationController {
  static async listHandler(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user;

    try {
      const notifications = await NotificationService.find(request.user.id);

      if (!notifications || notifications.length === 0) {
        return reply.status(404).send({
          message: "No notifications found",
        });
      }

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
