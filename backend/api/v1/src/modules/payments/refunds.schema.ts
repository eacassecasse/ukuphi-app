import { z } from "zod";
import {
  RefundReasonSchema,
  RefundStatusSchema,
} from "@lib/schemas/schemas.enums";

export const RefundSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  processedById: z.string().uuid().optional(),
  amount: z.number().positive(),
  reason: RefundReasonSchema,
  status: RefundStatusSchema.default("PENDING"),
  gatewayId: z.string().optional(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
});

export const CreateRefundSchema = RefundSchema.pick({
  orderId: true,
  amount: true,
  reason: true,
});

export const ProcessRefundSchema = z.object({
  refundId: z.string().uuid(),
  gatewayId: z.string(),
});
