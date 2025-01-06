"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const validation_zod_1 = require("../utils/validation.zod");
const NotificationService_1 = require("../services/NotificationService");
const notification_schema_1 = require("../inputs/notification.schema");
const redis_1 = require("../lib/redis");
class NotificationController {
    static async listHandler(request, reply) {
        const user = request.user;
        await redis_1.redis.connect();
        const cacheKey = `user-${request.user.id}-notifications`;
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return reply.status(200).send(JSON.parse(cached));
        }
        const notifications = await NotificationService_1.NotificationService.find(request.user.id);
        if (!notifications || notifications.length === 0) {
            return reply.status(404).send({
                message: "No notifications found",
            });
        }
        await redis_1.redis.set(cacheKey, JSON.stringify(notifications), 3600);
        return reply.status(200).send(notifications);
    }
    static async updateHandler(request, reply) {
        const { id } = request.params;
        if (!id) {
            return reply.status(400).send({
                message: "Missing ID param",
            });
        }
        const notification = await NotificationService_1.NotificationService.update(request.user.id, {
            id,
        });
        await (0, validation_zod_1.validateWithZod)(notification_schema_1.schemas.createNotificationResponseSchema)(notification);
        return reply.status(200).send(notification);
    }
}
exports.NotificationController = NotificationController;
