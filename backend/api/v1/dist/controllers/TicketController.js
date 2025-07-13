"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const validation_zod_1 = require("../utils/validation.zod");
const ticket_schema_1 = require("../inputs/ticket.schema");
const TicketService_1 = require("../services/TicketService");
const payment_schema_1 = require("../inputs/payment.schema");
const redis_1 = require("../lib/redis");
const NotificationService_1 = require("../services/NotificationService");
class TicketController {
    static async registerHandler(request, reply) {
        if (request.user.role === "ATTENDEE") {
            return reply.status(403).send({
                message: "Not authorized",
            });
        }
        const body = (0, validation_zod_1.validateWithZod)(ticket_schema_1.schemas.ticketCore)(request.body);
        const { id } = request.params;
        if (!id) {
            return reply.status(400).send({
                message: "Missing ID param",
            });
        }
        const ticket = await TicketService_1.TicketService.addTicket(request.user.id, {
            event_id: id,
            ...body,
        });
        await (0, validation_zod_1.validateWithZod)(ticket_schema_1.schemas.createTicketResponseSchema)(ticket);
        await NotificationService_1.NotificationService.create(request.user.id, {
            message: `A new ticket ${ticket.id} was successfully created for Event ${ticket.event.id}.`,
            type: "INFO",
            status: "UNREAD",
        });
        return reply.status(201).send(ticket);
    }
    static async listHandler(request, reply) {
        const { id } = request.params;
        if (!id) {
            return reply.status(400).send({
                message: "Missing ID param",
            });
        }
        await redis_1.redis.connect();
        const cacheKey = `events-${id}-tickets`;
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return reply.status(200).send(JSON.parse(cached));
        }
        const tickets = await TicketService_1.TicketService.find(id);
        if (!tickets || tickets.length === 0) {
            return reply.status(404).send({
                message: "No ticket found for this event",
            });
        }
        await redis_1.redis.set(cacheKey, JSON.stringify(tickets), 3600);
        return reply.status(200).send(tickets);
    }
    static async getHandler(request, reply) {
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
        await redis_1.redis.connect();
        const cacheKey = `events-${id}-tickets:${ticketId}`;
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return reply.status(200).send(JSON.parse(cached));
        }
        const ticket = await TicketService_1.TicketService.findOne(id, ticketId);
        await (0, validation_zod_1.validateWithZod)(ticket_schema_1.schemas.createTicketResponseSchema)(ticket);
        await redis_1.redis.set(cacheKey, JSON.stringify(ticket), 3600);
        return reply.status(200).send(ticket);
    }
    static async updateHandler(request, reply) {
        if (request.user.role === "ATTENDEE") {
            return reply.status(403).send({
                message: "Not authorized",
            });
        }
        const body = (0, validation_zod_1.validateWithZod)(ticket_schema_1.schemas.updateTicketCore)(request.body);
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
        const ticket = await TicketService_1.TicketService.updateTicket(request.user.id, {
            id: ticketId,
            event_id: id,
            ...body,
        });
        await (0, validation_zod_1.validateWithZod)(ticket_schema_1.schemas.createTicketResponseSchema)(ticket);
        await NotificationService_1.NotificationService.create(request.user.id, {
            message: `Ticket ${ticket.id} was successfully updated.`,
            type: "INFO",
            status: "UNREAD",
        });
        return reply.status(200).send(ticket);
    }
    static async deleteHandler(request, reply) {
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
        await TicketService_1.TicketService.removeEvent(request.user.id, {
            event_id: id,
            ticket_id: ticketId,
        });
        await NotificationService_1.NotificationService.create(request.user.id, {
            message: `Ticket ${id} was successfully deleted.`,
            type: "WARNING",
            status: "UNREAD",
        });
        return reply.status(204).send();
    }
    static async purchaseHandler(request, reply) {
        const body = (0, validation_zod_1.validateWithZod)(payment_schema_1.schemas.paymentCore)(request.body);
        const { id } = request.params;
        if (!id) {
            return reply.status(400).send({
                message: "Missing ID param",
            });
        }
        const payment = await TicketService_1.TicketService.purchase(request.user.id, {
            ticket_id: id,
            ...body,
        });
        await (0, validation_zod_1.validateWithZod)(payment_schema_1.schemas.createPaymentResponseSchema)(payment);
        await NotificationService_1.NotificationService.create(request.user.id, {
            message: `Ticket ${id} was successfully purchased.`,
            type: "INFO",
            status: "UNREAD",
        });
        return reply.status(201).send(payment);
    }
    static async viewPaymentHandler(request, reply) {
        const { id } = request.params;
        if (!id) {
            return reply.status(400).send({
                message: "Missing ID param",
            });
        }
        const payment = await TicketService_1.TicketService.viewPayment(request.user.id, id);
        return reply.status(200).send(payment);
    }
}
exports.TicketController = TicketController;
