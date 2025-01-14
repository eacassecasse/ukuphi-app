import QRCode from "qrcode";
import { CreatePaymentInput } from "../inputs/payment.schema";
import { CreateTicketInput, UpdateTicketInput } from "../inputs/ticket.schema";
import { db } from "../lib/prisma";
import { EventService } from "./EventService";
import { NotFoundError } from "../models/errors";

export class TicketService {
  static async find(eventId: string) {
    const tickets = await db.ticket.findMany({
      where: {
        eventId,
      },
    });

    if (tickets.length === 0) {
      throw new NotFoundError("No tickets found");
    }

    return tickets;
  }

  static async findOne(id: string, ticketId: string) {
    const event = await EventService.findOne(id);

    const ticket = await db.ticket.findUnique({
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
      throw new NotFoundError("Ticket not found");
    }

    return ticket;
  }

  static async addTicket(id: string, input: CreateTicketInput) {
    const { event_id, ...rest } = input;

    const event = await db.event.findUnique({
      where: {
        id: event_id,
        organizerId: id,
      },
    });

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    const ticket = await db.ticket.create({
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

  static async updateTicket(organizerId: string, input: UpdateTicketInput) {
    const { event_id, id, ...rest } = input;

    const event = await db.event.findUnique({
      where: {
        id: event_id,
        organizerId: organizerId,
      },
    });

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    await TicketService.findOne(event.id, id);

    const updatedData = {
      ...(input.price ? { price: input.price } : {}),
      ...(input.existentQuantity
        ? { existentQuantity: input.existentQuantity }
        : {}),
      ...(input.type ? { type: input.type } : {}),
    };

    const ticket = await db.ticket.update({
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

  static async removeEvent(
    id: string,
    params: { event_id: string; ticket_id: string }
  ) {
    const event = await db.event.findUnique({
      where: {
        id: params.event_id,
        organizerId: id,
      },
    });

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    await db.ticket.delete({
      where: { id: params.ticket_id, eventId: event.id },
    });
  }

  static async purchase(userId: string, input: CreatePaymentInput) {
    const { ticket_id, ...rest } = input;

    const ticket = await db.ticket.findUnique({
      where: {
        id: ticket_id,
      },
    });

    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    const existingPayment = await db.payment.findUnique({
      where: {
        userId_ticketId: {
          userId,
          ticketId: ticket.id
        }
      },
    });

    let payment = null;

    if (existingPayment) {
      payment = await db.payment.update({
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
    } else {
      const qrCode = await QRCode.toDataURL(
        `user-${userId}:payment:${ticket.id}:${input.method}-${input.amount}`
      );

      payment = await db.payment.create({
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

    await db.ticket.update({
      where: {
        id: ticket.id,
      },
      data: {
        existingQuantity: ticket.existingQuantity - input.amount,
      },
    });

    return payment;
  }

  static async viewPayment(userId: string, ticketId: string) {
    const payment = await db.payment.findUnique({
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
      throw new NotFoundError("Ticket purchase not made yet");
    }

    return payment;
  }
}
