import * as z from "zod";

const paymentCore = z.object({
  amount: z.number({
    required_error: "Amount is required",
  }),
  method: z.string({
    required_error: "Method is required",
  }),
});

const createPaymentSchema = paymentCore.extend({
  ticket_id: z
    .string({
      invalid_type_error: "The Ticket ID must be a valid UUID String",
    })
    .uuid(),
});

const updatePaymentSchema = createPaymentSchema.extend({
  id: z.string(),
});

const createPaymentResponseSchema = paymentCore.extend({
  id: z.string(),
  status: z.string(),
  qr_code: z.string(),
  created_at: z.date(),
  ticket: z.object({
    id: z.string(),
    type: z.string(),
    price: z.number(),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CreatePaymentResponse = z.infer<typeof createPaymentResponseSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;

export const schemas = {
  createPaymentSchema,
  createPaymentResponseSchema,
  paymentCore
};
