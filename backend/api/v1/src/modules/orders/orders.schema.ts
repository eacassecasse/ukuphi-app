import { z } from "zod";
import {
  OrderStatusSchema,
  PaymentMethodSchema,
} from "@lib/schemas/schemas.enums";

export const OrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  eventId: z.string().uuid(),
  status: OrderStatusSchema.default("PENDING_PAYMENT"),
  totalAmount: z.number().min(0),
  currency: z.string().length(3).default("MZN"),
  paymentMethod: PaymentMethodSchema.optional(),
  paymentGatewayId: z.string().optional(),
  paymentData: z.record(z.unknown()).optional(),
  paymentQrCode: z.string().optional(),
  paymentAttempts: z.number().default(0),
  reservationExpiresAt: z.date().optional(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
  refundedAt: z.date().optional(),
});

export const CreateOrderSchema = z.object({
  eventId: z.string().uuid(),
  tickets: z.array(
    z.object({
      ticketTypeId: z.string().uuid(),
      quantity: z.number().min(1),
      attendeeName: z.string().optional(),
      attendeeEmail: z.string().email().optional(),
    })
  ),
  paymentMethod: PaymentMethodSchema,
});

export const OrderResponseSchema = OrderSchema.extend({
  tickets: z.array(
    z.object({
      id: z.string().uuid(),
      qrCode: z.string(),
      status: z.string(),
    })
  ),
});

export const ProcessPaymentSchema = z.object({
  orderId: z.string().uuid(),
  paymentData: z.record(z.unknown()),
});
