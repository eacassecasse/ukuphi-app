"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const prisma_1 = require("../lib/prisma");
const EventService_1 = require("./EventService");
const errors_1 = require("../models/errors");
class TicketService {
    static async find(eventId) {
        const tickets = await prisma_1.db.ticket.findMany({
            where: {
                eventId,
            },
        });
        if (tickets.length === 0) {
            throw new errors_1.NotFoundError("No tickets found");
        }
        return tickets;
    }
    static async findOne(id, ticketId) {
        const event = await EventService_1.EventService.findOne(id);
        const ticket = await prisma_1.db.ticket.findUnique({
            where: {
                id: ticketId,
                eventId: event.id,
            },
            select: {
                id: true,
                price: true,
                type: true,
                existingQuantity: true,
                event: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        location: true,
                        date: true,
                    },
                },
            },
        });
        if (!ticket) {
            throw new errors_1.NotFoundError("Ticket not found");
        }
        return ticket;
    }
    static async addTicket(id, input) {
        const { event_id, ...rest } = input;
        const event = await prisma_1.db.event.findUnique({
            where: {
                id: event_id,
                organizerId: id,
            },
        });
        if (!event) {
            throw new errors_1.NotFoundError("Event not found");
        }
        const ticket = await prisma_1.db.ticket.create({
            data: {
                eventId: event.id,
                ...rest,
            },
            select: {
                id: true,
                price: true,
                type: true,
                existingQuantity: true,
                event: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        location: true,
                        date: true,
                    },
                },
            },
        });
        return ticket;
    }
    static async updateTicket(organizerId, input) {
        const { event_id, id, ...rest } = input;
        const event = await prisma_1.db.event.findUnique({
            where: {
                id: event_id,
                organizerId: organizerId,
            },
        });
        if (!event) {
            throw new errors_1.NotFoundError("Event not found");
        }
        await TicketService.findOne(event.id, id);
        const updatedData = {
            ...(input.price ? { price: input.price } : {}),
            ...(input.existentQuantity
                ? { existentQuantity: input.existentQuantity }
                : {}),
            ...(input.type ? { type: input.type } : {}),
        };
        const ticket = await prisma_1.db.ticket.update({
            where: {
                id,
                eventId: event.id,
            },
            data: updatedData,
            select: {
                id: true,
                price: true,
                type: true,
                existingQuantity: true,
                event: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        location: true,
                        date: true,
                    },
                },
            },
        });
        return ticket;
    }
    static async removeEvent(id, params) {
        const event = await prisma_1.db.event.findUnique({
            where: {
                id: params.event_id,
                organizerId: id,
            },
        });
        if (!event) {
            throw new errors_1.NotFoundError("Event not found");
        }
        await prisma_1.db.ticket.delete({
            where: { id: params.ticket_id, eventId: event.id },
        });
    }
    static async purchase(userId, input) {
        const { ticket_id, ...rest } = input;
        const ticket = await prisma_1.db.ticket.findUnique({
            where: {
                id: ticket_id,
            },
        });
        if (!ticket) {
            throw new errors_1.NotFoundError("Ticket not found.");
        }
        const existingPayment = await prisma_1.db.payment.findUnique({
            where: {
                userId_ticketId: {
                    userId,
                    ticketId: ticket.id
                }
            },
        });
        let payment = null;
        if (existingPayment) {
            payment = await prisma_1.db.payment.update({
                where: {
                    id: existingPayment.id,
                },
                data: {
                    amount: existingPayment.amount + input.amount,
                },
                select: {
                    id: true,
                    amount: true,
                    method: true,
                    qr_code: true,
                    status: true,
                    created_at: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    ticket: {
                        select: {
                            id: true,
                            price: true,
                            existingQuantity: true,
                            type: true,
                        },
                    },
                },
            });
        }
        else {
            const qrCode = await qrcode_1.default.toDataURL(`user-${userId}:payment:${ticket.id}:${input.method}-${input.amount}`);
            payment = await prisma_1.db.payment.create({
                data: {
                    userId,
                    ticketId: ticket.id,
                    status: "CONFIRMED",
                    qr_code: qrCode,
                    ...rest,
                },
                select: {
                    id: true,
                    amount: true,
                    method: true,
                    qr_code: true,
                    status: true,
                    created_at: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    ticket: {
                        select: {
                            id: true,
                            price: true,
                            existingQuantity: true,
                            type: true,
                        },
                    },
                },
            });
        }
        await prisma_1.db.ticket.update({
            where: {
                id: ticket.id,
            },
            data: {
                existingQuantity: ticket.existingQuantity - input.amount,
            },
        });
        return payment;
    }
    static async viewPayment(userId, ticketId) {
        const payment = await prisma_1.db.payment.findUnique({
            where: {
                userId_ticketId: {
                    userId,
                    ticketId
                }
            },
            include: {
                ticket: true,
            },
        });
        if (!payment) {
            throw new errors_1.NotFoundError("Ticket purchase not made yet");
        }
        return payment;
    }
}
exports.TicketService = TicketService;
