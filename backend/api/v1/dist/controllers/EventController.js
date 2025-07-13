"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const EventService_1 = require("../services/EventService");
const event_schema_1 = require("../inputs/event.schema");
const validation_zod_1 = require("../utils/validation.zod");
const comment_schema_1 = require("../inputs/comment.schema");
const redis_1 = require("../lib/redis");
const NotificationService_1 = require("../services/NotificationService");
class EventController {
    static async registerHandler(request, reply) {
        if (request.user.role === "ATTENDEE") {
            return reply.status(403).send({
                message: "Not authorized",
            });
        }
        const body = (0, validation_zod_1.validateWithZod)(event_schema_1.schemas.createEventSchema)(request.body);
        try {
            const event = await EventService_1.EventService.createEvent(request.user.id, body);
            const response = {
                ...event,
                date: event.date.toISOString().replace("T", " ").split(".")[0],
            };
            await NotificationService_1.NotificationService.create(request.user.id, {
                message: `A new event ${event.id} was successfully created.`,
                type: "INFO",
                status: "UNREAD",
            });
            return reply.status(201).send(response);
        }
        catch (error) {
            console.error(error);
            reply.status(500).send({
                message: "Internal Server Error",
                error: error,
            });
        }
    }
    static async listHandler(request, reply) {
        await redis_1.redis.connect();
        const cacheKey = "events-cached";
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return reply.status(200).send(JSON.parse(cached));
        }
        const events = await EventService_1.EventService.find();
        if (!events || events.length === 0) {
            return reply.status(404).send({
                message: "No events found",
            });
        }
        await redis_1.redis.set(cacheKey, JSON.stringify(events), 3600);
        return reply.status(200).send(events);
    }
    static async getHandler(request, reply) {
        const { id } = request.params;
        if (!id) {
            return reply.status(400).send({
                message: "Missing ID param",
            });
        }
        await redis_1.redis.connect();
        const cacheKey = `events:${id}`;
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return reply.status(200).send(JSON.parse(cached));
        }
        const event = await EventService_1.EventService.findOne(id);
        const response = {
            ...event,
            date: event.date.toISOString().replace("T", " ").split(".")[0],
        };
        await redis_1.redis.set(cacheKey, JSON.stringify(response), 3600);
        return reply.status(200).send(response);
    }
    static async updateHandler(request, reply) {
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
        const body = (0, validation_zod_1.validateWithZod)(event_schema_1.schemas.updateEventCore)(request.body);
        const input = {
            id,
            ...body,
        };
        const event = await EventService_1.EventService.updateEvent(request.user.id, input);
        const response = {
            ...event,
            date: event.date.toISOString().replace("T", " ").split(".")[0],
        };
        await NotificationService_1.NotificationService.create(request.user.id, {
            message: `Event ${event.id} was successfully updated.`,
            type: "INFO",
            status: "UNREAD",
        });
        return reply.status(200).send(response);
    }
    static async deleteHandler(request, reply) {
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
        await EventService_1.EventService.deleteEvent(request.user.id, id);
        NotificationService_1.NotificationService.create(request.user.id, {
            message: `Event ${id} was successfully deleted`,
            type: "WARNING",
            status: "UNREAD",
        });
        return reply.status(204).send();
    }
    static async commentHandler(request, reply) {
        const body = (0, validation_zod_1.validateWithZod)(comment_schema_1.schemas.createCommentSchema)(request.body);
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
        const comment = await EventService_1.EventService.comment(request.user.id, input);
        await (0, validation_zod_1.validateWithZod)(comment_schema_1.schemas.createEventCommentResponseSchema)(comment);
        await NotificationService_1.NotificationService.create(request.user.id, {
            message: `Event ${id} has a new comment`,
            type: "INFO",
            status: "UNREAD",
        });
        return reply.status(201).send(comment);
    }
    static async listCommentsHandler(request, reply) {
        const { id } = request.params;
        if (!id) {
            return reply.status(400).send({
                message: "Missing ID param",
            });
        }
        const comments = await EventService_1.EventService.listComments(id);
        if (!comments || comments.length === 0) {
            return reply.status(404).send({
                message: "No comment found for this event",
            });
        }
        return reply.status(200).send(comments);
    }
}
exports.EventController = EventController;
