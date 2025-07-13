import { z } from "zod";
import { TicketStatusSchema } from "@lib/schemas/schemas.enums";

export const TicketTypeSchema = z.object({
  id: z.string().uuid(),
  eventId: z.string().uuid(),
  name: z.string().min(3).max(50),
  description: z.string().max(500).optional(),
  price: z.number().min(0),
  currency: z.string().length(3).default("MZN"),
  bookingFee: z.number().min(0).default(0),
  isTransferable: z.boolean().default(true),
  minPerOrder: z.number().min(1).default(1),
  maxPerOrder: z.number().min(1).optional(),
  salesStart: z.date(),
  salesEnd: z.date().optional(),
  createdAt: z.date(),
});

export const TicketInventorySchema = z.object({
  id: z.string().uuid(),
  ticketTypeId: z.string().uuid(),
  initialQuantity: z.number().min(0),
  availableQuantity: z.number().min(0),
  holdQuantity: z.number().min(0).default(0),
  version: z.number().min(0).default(0),
});

export const TicketSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  ticketTypeId: z.string().uuid(),
  eventId: z.string().uuid(),
  attendeeName: z.string().optional(),
  attendeeEmail: z.string().email().optional(),
  qrCode: z.string(),
  status: TicketStatusSchema.default("ACTIVE"),
  checkInTime: z.date().optional(),
  transferToken: z.string().optional(),
  createdAt: z.date(),
});

export const CreateTicketTypeSchema = TicketTypeSchema.pick({
  name: true,
  description: true,
  price: true,
  currency: true,
  bookingFee: true,
  isTransferable: true,
  minPerOrder: true,
  maxPerOrder: true,
  salesStart: true,
  salesEnd: true,
}).extend({
  initialQuantity: z.number().min(1),
});
