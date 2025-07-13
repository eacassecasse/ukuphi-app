"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const prisma_1 = require("../lib/prisma");
const errors_1 = require("../models/errors");
const UserService_1 = require("./UserService");
class EventService {
    static async find() {
        const events = await prisma_1.db.event.findMany({});
        if (events.length === 0) {
            throw new errors_1.NotFoundError("No events found");
        }
        return events;
    }
    static async findEventsByOrganizer(id) {
        const organizer = await UserService_1.UserService.findOne(id);
        const events = await prisma_1.db.event.findMany({
            where: {
                organizerId: organizer.id,
            },
        });
        if (events.length === 0) {
            throw new errors_1.NotFoundError("No events found for the organizer");
        }
        return events;
    }
    static async findOne(id) {
        const event = await prisma_1.db.event.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                location: true,
                date: true,
                image_url: true,
                tickets_sold: true,
                organizer: true,
            },
        });
        if (!event) {
            throw new errors_1.NotFoundError("Event not found");
        }
        return event;
    }
    static async createEvent(id, input) {
        const { date, ...rest } = input;
        const event = await prisma_1.db.event.create({
            data: {
                ...rest,
                date: new Date(date.replace(" ", "T")),
                organizerId: id,
            },
        });
        return event;
    }
    static async updateEvent(id, input) {
        const { date, ...rest } = input;
        const dbEvent = await prisma_1.db.event.findUnique({
            where: {
                id: input.id,
                organizerId: id,
            },
        });
        if (!dbEvent) {
            throw new errors_1.NotFoundError("Event not found");
        }
        const updatedData = {
            ...(input.title ? { title: input.title } : {}),
            ...(input.description ? { description: input.description } : {}),
            ...(input.date ? { date: new Date(input.date.replace(" ", "T")) } : {}),
            ...(input.image_url ? { image_url: input.image_url } : {}),
            ...(input.location ? { location: input.location } : {}),
        };
        const event = await prisma_1.db.event.update({
            where: {
                id: dbEvent.id,
                organizerId: id,
            },
            data: updatedData,
        });
        return event;
    }
    static async deleteEvent(organizerId, id) {
        const event = await prisma_1.db.event.findUnique({
            where: {
                id,
                organizerId,
            },
        });
        if (!event) {
            throw new errors_1.NotFoundError("Event not found");
        }
        await prisma_1.db.event.delete({
            where: { id: event.id },
        });
    }
    static async comment(id, input) {
        const event = await EventService.findOne(input.event_id);
        const comment = await prisma_1.db.comment.create({
            data: {
                title: input.title,
                content: input.content,
                commentedAt: new Date(),
                userId: id,
                event_comments: {
                    create: {
                        eventId: event.id,
                    },
                },
            },
            select: {
                id: true,
                title: true,
                content: true,
                commentedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                event_comments: {
                    select: {
                        event: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                location: true,
                                date: true
                            }
                        }
                    }
                }
            },
        });
        return comment;
    }
    static async listComments(eventId) {
        const comments = await prisma_1.db.event_Comment.findMany({
            where: {
                eventId,
            },
            select: {
                comment: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        commentedAt: true,
                    },
                }, event: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        location: true,
                        date: true
                    }
                }
            },
        });
        if (comments.length === 0) {
            throw new errors_1.NotFoundError("No comments found");
        }
        return comments;
    }
}
exports.EventService = EventService;
